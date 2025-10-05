import { supabase } from '../config/supabase.js';
import { performAdvancedAnalysis } from '../services/analysisService.js';
import { checkWebsiteAccessibility } from '../utils/websiteUtils.js';
import { ComparisonService } from '../services/comparisonService.js';
import { ReportService } from '../services/reportService.js';

export const analyzeWebsite = async (req, res) => {
  try {
    const { url, userId } = req.body;

    if (!url || !userId) {
      return res.status(400).json({ error: 'URL and userId are required' });
    }

    console.log(`🔍 Analyzing website: ${url} for user: ${userId}`);

    // Check website accessibility
    const { isAccessible, responseTime, title, statusCode } = await checkWebsiteAccessibility(url);

    let websiteId;

    if (supabase) {
      // Check if website already exists
      const { data: existingWebsite } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', userId)
        .eq('url', url)
        .single();

      if (existingWebsite) {
        websiteId = existingWebsite.id;
      } else {
        // Create new website record
        const { data: newWebsite, error: websiteError } = await supabase
          .from('websites')
          .insert([{
            user_id: userId,
            url: url,
            title: title
          }])
          .select('id')
          .single();

        if (websiteError) throw websiteError;
        websiteId = newWebsite.id;
      }
    } else {
      websiteId = crypto.randomUUID();
    }

    // Perform analysis
    const analysis = await performAdvancedAnalysis(url, isAccessible, responseTime);

    // Store additional metadata
    const analysisMetadata = {
      statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
      userAgent: 'WebBaseline Pro Bot 1.0',
      baseline2024Compliant: analysis.baseline?.overall?.compliance === 'excellent'
    };

    if (supabase) {
      // Store analysis results
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .insert([{
          website_id: websiteId,
          performance_score: analysis.performance?.score || 0,
          seo_score: analysis.seo?.score || 0,
          accessibility_score: analysis.accessibility?.score || 0,
          security_score: analysis.security?.score || 0,
          overall_score: analysis.overall.score,
          performance_details: { 
            ...analysis.performance?.details || {}, 
            metadata: analysisMetadata,
            lighthouse: analysis.lighthouse?.performance || {}
          },
          seo_details: {
            ...analysis.seo?.details || {},
            lighthouse: analysis.lighthouse?.seo || {}
          },
          accessibility_details: {
            ...analysis.accessibility?.details || {},
            lighthouse: analysis.lighthouse?.accessibility || {}
          },
          security_details: {
            ...analysis.security?.details || {},
            lighthouse: analysis.lighthouse?.bestPractices || {}
          }
        }])
        .select()
        .single();

      if (analysisError) throw analysisError;

      res.json({
        success: true,
        websiteId,
        metadata: analysisMetadata,
        analysis: {
          ...analysis,
          id: analysisData.id,
          created_at: analysisData.created_at
        }
      });
    } else {
      res.json({
        success: true,
        websiteId,
        analysis: {
          ...analysis,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze website',
      details: error.message 
    });
  }
};

export const getUserWebsites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!supabase) {
      return res.json([]);
    }

    const { data: websites, error } = await supabase
      .from('websites')
      .select(`
        id,
        url,
        title,
        created_at,
        analyses (
          id,
          performance_score,
          seo_score,
          accessibility_score,
          security_score,
          overall_score,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const websitesWithLatestAnalysis = websites.map(website => {
      const latestAnalysis = website.analyses?.length > 0 
        ? website.analyses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        : null;

      return {
        ...website,
        latestAnalysis,
        totalAnalyses: website.analyses?.length || 0
      };
    });

    res.json(websitesWithLatestAnalysis);

  } catch (error) {
    console.error('❌ Fetch websites error:', error);
    res.status(500).json({ error: 'Failed to fetch websites' });
  }
};

export const deleteWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;

    if (!supabase) {
      return res.json({ success: true });
    }

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId);

    if (error) throw error;

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Delete website error:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
};

export const getWebsiteAnalyses = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { limit = 10 } = req.query;

    if (!supabase) {
      return res.json([]);
    }

    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json(analyses);

  } catch (error) {
    console.error('❌ Fetch analyses error:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
};

export const bulkAnalyzeWebsites = async (req, res) => {
  try {
    const { urls, userId } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array is required' });
    }

    if (urls.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 URLs allowed per bulk analysis' });
    }

    console.log(`🔍 Bulk analyzing ${urls.length} websites for user: ${userId}`);

    const results = [];
    
    for (const url of urls) {
      try {
        const { isAccessible, responseTime, title } = await checkWebsiteAccessibility(url);
        const analysis = await performAdvancedAnalysis(url, isAccessible, responseTime);
        
        // Store in database if available
        let websiteId;
        if (supabase) {
          const { data: existingWebsite } = await supabase
            .from('websites')
            .select('id')
            .eq('user_id', userId)
            .eq('url', url)
            .single();

          if (existingWebsite) {
            websiteId = existingWebsite.id;
          } else {
            const { data: newWebsite } = await supabase
              .from('websites')
              .insert([{ user_id: userId, url, title }])
              .select('id')
              .single();
            websiteId = newWebsite?.id;
          }

          if (websiteId) {
            await supabase
              .from('analyses')
              .insert([{
                website_id: websiteId,
                performance_score: analysis.performance?.score || 0,
                seo_score: analysis.seo?.score || 0,
                accessibility_score: analysis.accessibility?.score || 0,
                security_score: analysis.security?.score || 0,
                overall_score: analysis.overall.score,
                performance_details: analysis.performance?.details || {},
                seo_details: analysis.seo?.details || {},
                accessibility_details: analysis.accessibility?.details || {},
                security_details: analysis.security?.details || {}
              }]);
          }
        }

        results.push({
          url,
          success: true,
          websiteId,
          analysis
        });

      } catch (error) {
        console.error(`❌ Analysis failed for ${url}:`, error);
        results.push({
          url,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results,
      summary: {
        total: urls.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('❌ Bulk analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to perform bulk analysis',
      details: error.message 
    });
  }
};

export const compareWebsites = async (req, res) => {
  try {
    const { websiteIds } = req.body;

    if (!websiteIds || !Array.isArray(websiteIds) || websiteIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 website IDs required for comparison' });
    }

    if (!supabase) {
      return res.status(400).json({ error: 'Database not available' });
    }

    const { data: websites, error } = await supabase
      .from('websites')
      .select(`
        id,
        url,
        title,
        analyses (
          performance_score,
          seo_score,
          accessibility_score,
          security_score,
          overall_score,
          created_at
        )
      `)
      .in('id', websiteIds)
      .order('created_at', { foreignTable: 'analyses', ascending: false });

    if (error) throw error;

    const comparison = websites.map(website => {
      const latestAnalysis = website.analyses[0];
      return {
        id: website.id,
        url: website.url,
        title: website.title,
        scores: latestAnalysis ? {
          overall: latestAnalysis.overall_score,
          performance: latestAnalysis.performance_score,
          seo: latestAnalysis.seo_score,
          accessibility: latestAnalysis.accessibility_score,
          security: latestAnalysis.security_score
        } : null,
        lastAnalyzed: latestAnalysis?.created_at
      };
    });

    res.json({
      success: true,
      comparison,
      summary: {
        bestOverall: comparison.reduce((best, current) => 
          (current.scores?.overall || 0) > (best.scores?.overall || 0) ? current : best
        ),
        averageScores: {
          overall: Math.round(comparison.reduce((sum, site) => sum + (site.scores?.overall || 0), 0) / comparison.length),
          performance: Math.round(comparison.reduce((sum, site) => sum + (site.scores?.performance || 0), 0) / comparison.length),
          seo: Math.round(comparison.reduce((sum, site) => sum + (site.scores?.seo || 0), 0) / comparison.length),
          accessibility: Math.round(comparison.reduce((sum, site) => sum + (site.scores?.accessibility || 0), 0) / comparison.length),
          security: Math.round(comparison.reduce((sum, site) => sum + (site.scores?.security || 0), 0) / comparison.length)
        }
      }
    });

  } catch (error) {
    console.error('❌ Website comparison error:', error);
    res.status(500).json({ error: 'Failed to compare websites' });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { websiteId, type = 'detailed', format = 'json' } = req.body;

    if (!supabase) {
      return res.status(400).json({ error: 'Database not available' });
    }

    // Get website and latest analysis
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select(`
        *,
        analyses (*)
      `)
      .eq('id', websiteId)
      .single();

    if (websiteError) throw websiteError;

    const latestAnalysis = website.analyses
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (!latestAnalysis) {
      return res.status(404).json({ error: 'No analysis found for this website' });
    }

    // Reconstruct analysis data
    const analysisData = {
      url: website.url,
      timestamp: latestAnalysis.created_at,
      overall: { score: latestAnalysis.overall_score },
      performance: { 
        score: latestAnalysis.performance_score,
        details: latestAnalysis.performance_details
      },
      seo: { 
        score: latestAnalysis.seo_score,
        details: latestAnalysis.seo_details
      },
      accessibility: { 
        score: latestAnalysis.accessibility_score,
        details: latestAnalysis.accessibility_details
      },
      security: { 
        score: latestAnalysis.security_score,
        details: latestAnalysis.security_details
      }
    };

    const reportService = new ReportService();
    const report = reportService.generateReport(analysisData, type, format);

    res.json({
      success: true,
      report,
      metadata: {
        websiteUrl: website.url,
        generatedAt: new Date().toISOString(),
        type,
        format
      }
    });

  } catch (error) {
    console.error('❌ Report generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: error.message 
    });
  }
};

export const getComplianceBadge = async (req, res) => {
  try {
    const { websiteId } = req.params;

    if (!supabase) {
      return res.status(400).json({ error: 'Database not available' });
    }

    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('overall_score, performance_score, seo_score, accessibility_score, security_score')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    // Calculate compliance score
    const complianceScore = Math.round((
      analysis.overall_score +
      analysis.performance_score +
      analysis.seo_score +
      analysis.accessibility_score +
      analysis.security_score
    ) / 5);

    const badge = generateComplianceBadge(complianceScore);

    res.json({
      success: true,
      badge,
      score: complianceScore,
      breakdown: {
        overall: analysis.overall_score,
        performance: analysis.performance_score,
        seo: analysis.seo_score,
        accessibility: analysis.accessibility_score,
        security: analysis.security_score
      }
    });

  } catch (error) {
    console.error('❌ Badge generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate compliance badge',
      details: error.message 
    });
  }
};

function generateComplianceBadge(score) {
  if (score >= 95) return { level: 'platinum', color: '#E5E4E2', label: 'Platinum Certified', icon: '🏆' };
  if (score >= 85) return { level: 'gold', color: '#FFD700', label: 'Gold Certified', icon: '🥇' };
  if (score >= 75) return { level: 'silver', color: '#C0C0C0', label: 'Silver Certified', icon: '🥈' };
  if (score >= 65) return { level: 'bronze', color: '#CD7F32', label: 'Bronze Certified', icon: '🥉' };
  return { level: 'none', color: '#666666', label: 'Not Certified', icon: '❌' };
}