# WebBaseline Pro API Documentation

## 📋 Overview

The WebBaseline Pro API provides programmatic access to website analysis, performance metrics, and compliance reporting features. This RESTful API allows developers to integrate WebBaseline Pro capabilities into their applications.

### 🔐 Authentication

All API requests require authentication via JWT tokens obtained through Supabase authentication.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### 🌐 Base URL

```
https://api.webbaseline.pro/v1
```

For local development:
```
http://localhost:3000/api
```

### 📦 Rate Limiting

- **Free Tier**: 50 requests per hour
- **Pro Tier**: 500 requests per hour
- **Enterprise**: Custom limits

Exceeding rate limits will result in a `429 Too Many Requests` response.

## 🚀 Endpoints

### 🔍 Website Analysis

#### Analyze Website
```http
POST /analyze
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "performance": true,
    "seo": true,
    "accessibility": true,
    "security": true,
    "baseline": true
  }
}
```

**Response:**
```json
{
  "id": "analysis_12345",
  "url": "https://example.com",
  "timestamp": "2025-10-05T14:30:00Z",
  "status": "completed",
  "overallScore": 87,
  "grade": "A-",
  "performance": {
    "score": 92,
    "metrics": {
      "lcp": 1800,
      "fid": 45,
      "cls": 0.08
    }
  },
  "seo": {
    "score": 85,
    "issues": []
  },
  "accessibility": {
    "score": 90,
    "issues": []
  },
  "security": {
    "score": 80,
    "issues": []
  },
  "baseline": {
    "score": 95,
    "compliance": "gold",
    "supportedFeatures": 45,
    "totalFeatures": 48
  }
}
```

#### Get Analysis Results
```http
GET /analyze/{analysisId}
```

**Response:**
```json
{
  "id": "analysis_12345",
  "url": "https://example.com",
  "timestamp": "2025-10-05T14:30:00Z",
  "status": "completed",
  "report": {
    // Full analysis report
  }
}
```

### 📊 Reports

#### Generate Report
```http
POST /reports
```

**Request Body:**
```json
{
  "analysisId": "analysis_12345",
  "format": "pdf", // pdf, csv, json
  "sections": ["performance", "seo", "accessibility", "security", "baseline"]
}
```

**Response:**
```json
{
  "id": "report_67890",
  "analysisId": "analysis_12345",
  "format": "pdf",
  "downloadUrl": "https://reports.webbaseline.pro/report_67890.pdf",
  "expiresAt": "2025-10-12T14:30:00Z"
}
```

#### Get Report
```http
GET /reports/{reportId}
```

### 🔄 Comparison

#### Compare Websites
```http
POST /compare
```

**Request Body:**
```json
{
  "urls": [
    "https://site1.com",
    "https://site2.com",
    "https://site3.com"
  ],
  "metrics": ["performance", "seo", "accessibility"]
}
```

**Response:**
```json
{
  "comparisonId": "compare_54321",
  "urls": ["https://site1.com", "https://site2.com", "https://site3.com"],
  "results": {
    "performance": {
      "https://site1.com": 92,
      "https://site2.com": 78,
      "https://site3.com": 85
    },
    "seo": {
      "https://site1.com": 85,
      "https://site2.com": 90,
      "https://site3.com": 75
    }
  }
}
```

### 📈 Historical Data

#### Get Website History
```http
GET /history?url=https://example.com&limit=10
```

**Response:**
```json
{
  "url": "https://example.com",
  "analyses": [
    {
      "id": "analysis_12345",
      "timestamp": "2025-10-05T14:30:00Z",
      "overallScore": 87,
      "performance": 92,
      "seo": 85,
      "accessibility": 90,
      "security": 80,
      "baseline": 95
    }
  ]
}
```

### 🛡️ Baseline Compliance

#### Check Baseline Compliance
```http
POST /baseline/check
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "baselineYear": "2024" // 2024 or 2025
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "baselineYear": "2024",
  "compliance": {
    "status": "compliant",
    "score": 95,
    "grade": "A",
    "supportedFeatures": 45,
    "totalFeatures": 48,
    "missingFeatures": [
      {
        "id": "feature_id",
        "name": "Feature Name",
        "description": "Feature description",
        "impact": "low"
      }
    ]
  }
}
```

## 📤 Request/Response Format

### Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid URL format",
    "details": {
      "field": "url",
      "value": "invalid-url"
    }
  }
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 🔧 SDKs & Libraries

### JavaScript/Node.js
```javascript
import { WebBaselineClient } from '@webbaseline/pro-sdk';

const client = new WebBaselineClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.webbaseline.pro/v1'
});

const analysis = await client.analyze('https://example.com');
```

### Python
```python
from webbaseline import Client

client = Client(api_key='YOUR_API_KEY')
analysis = client.analyze('https://example.com')
```

## 📈 Webhooks

### Configure Webhooks
```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["analysis.completed", "report.generated"],
  "secret": "webhook_secret"
}
```

### Webhook Events

| Event | Description |
|-------|-------------|
| `analysis.completed` | Analysis has finished |
| `report.generated` | Report is ready for download |
| `baseline.compliant` | Website achieved baseline compliance |
| `performance.improved` | Performance score improved |

### Webhook Payload
```json
{
  "id": "wh_12345",
  "event": "analysis.completed",
  "timestamp": "2025-10-05T14:30:00Z",
  "data": {
    "analysisId": "analysis_12345",
    "url": "https://example.com",
    "overallScore": 87
  },
  "signature": "webhook_signature"
}
```

## 🔒 Security

### Data Protection
- All data is encrypted in transit (TLS 1.3)
- Sensitive data is encrypted at rest
- Regular security audits and penetration testing
- GDPR and CCPA compliant

### API Keys
- Rotate API keys regularly
- Restrict API key permissions
- Monitor API key usage
- Use different keys for different environments

## 🆘 Support

### Documentation
- [User Guide](./USER_GUIDE.md)
- [Integration Examples](./examples/)
- [Troubleshooting](./TROUBLESHOOTING.md)

### Contact Support
For API-related questions or issues:
- **Email**: [api-support@webbaseline.pro](mailto:api-support@webbaseline.pro)
- **Status Page**: [status.webbaseline.pro](https://status.webbaseline.pro)
- **Community Forum**: [forum.webbaseline.pro](https://forum.webbaseline.pro)

## 📅 Changelog

### v1.2.0 (2025-10-05)
- Added Baseline 2025 compliance checking
- Improved performance analysis accuracy
- Enhanced security scanning capabilities

### v1.1.0 (2025-09-15)
- Added comparison endpoints
- Improved error handling
- Added webhook support

### v1.0.0 (2025-09-01)
- Initial API release
- Core analysis endpoints
- Report generation capabilities