import express from 'express';
import { 
  analyzeWebsite, 
  getUserWebsites, 
  deleteWebsite, 
  getWebsiteAnalyses,
  bulkAnalyzeWebsites,
  compareWebsites,
  generateReport,
  getComplianceBadge
} from '../controllers/websiteController.js';

const router = express.Router();

router.post('/analyze', analyzeWebsite);
router.post('/analyze/bulk', bulkAnalyzeWebsites);
router.post('/compare', compareWebsites);
router.post('/report', generateReport);
router.get('/user/:userId', getUserWebsites);
router.get('/:websiteId/analyses', getWebsiteAnalyses);
router.get('/:websiteId/badge', getComplianceBadge);
router.delete('/:websiteId', deleteWebsite);

export default router;