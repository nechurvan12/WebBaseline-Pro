# API Integration Examples

Example code for integrating with the WebBaseline Pro API in various programming languages and frameworks.

## 📚 Available Examples

### JavaScript/Node.js
- [Basic Analysis](./javascript/basic-analysis.js) - Simple website analysis
- [Batch Processing](./javascript/batch-processing.js) - Analyze multiple websites
- [Webhook Handler](./javascript/webhook-handler.js) - Handle real-time notifications

### Python
- [Analysis Script](./python/analyze.py) - Python analysis implementation
- [Report Generator](./python/generate-report.py) - Automated report creation
- [Comparison Tool](./python/compare.py) - Compare multiple websites

### PHP
- [Simple Integration](./php/simple.php) - Basic API usage
- [WordPress Plugin](./php/wordpress-plugin.php) - WordPress integration example

### Ruby
- [Ruby Client](./ruby/client.rb) - Ruby API client implementation

### cURL
- [Command Line Examples](./curl/examples.sh) - Terminal-based API calls

## 🚀 Quick Start Examples

### JavaScript
```javascript
import { WebBaselineClient } from '@webbaseline/pro-sdk';

const client = new WebBaselineClient({
  apiKey: 'YOUR_API_KEY'
});

// Analyze a website
const analysis = await client.analyze('https://example.com');
console.log(`Overall Score: ${analysis.overallScore}`);
```

### Python
```python
from webbaseline import Client

client = Client(api_key='YOUR_API_KEY')

# Analyze a website
analysis = client.analyze('https://example.com')
print(f"Overall Score: {analysis.overall_score}")
```

### cURL
```bash
curl -X POST https://api.webbaseline.pro/v1/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 📖 Documentation

For complete API documentation, see:
- [API Reference](../API.md)
- [Authentication Guide](../API.md#authentication)
- [Rate Limiting](../API.md#rate-limiting)
- [Error Handling](../API.md#error-responses)

## 🛠 Requirements

### JavaScript
- Node.js 14+
- npm or yarn

### Python
- Python 3.7+
- pip

### PHP
- PHP 7.4+
- cURL extension

### Ruby
- Ruby 2.7+
- bundler

## 📦 Installation

### JavaScript
```bash
npm install @webbaseline/pro-sdk
# or
yarn add @webbaseline/pro-sdk
```

### Python
```bash
pip install webbaseline-pro
```

### PHP
```bash
# No installation required for basic usage
# For WordPress plugin, copy to wp-content/plugins/
```

### Ruby
```bash
gem install webbaseline-pro
```

## 🧪 Testing Examples

### JavaScript
```bash
cd javascript
node basic-analysis.js
```

### Python
```bash
cd python
python analyze.py
```

### PHP
```bash
cd php
php simple.php
```

### Ruby
```bash
cd ruby
ruby client.rb
```

## 🤝 Contributing Examples

Want to add an example in your favorite language or framework?

1. Fork the repository
2. Create a new directory for your language
3. Add your example code
4. Update this README with a link to your example
5. Submit a pull request

### Guidelines for Examples

- Include clear comments explaining the code
- Follow language-specific best practices
- Handle errors appropriately
- Use environment variables for API keys
- Include a README with setup instructions

## 📞 Support

For help with API integration:

- **Documentation**: [API.md](../API.md)
- **Support Email**: [api-support@webbaseline.pro](mailto:api-support@webbaseline.pro)
- **Community Forum**: [forum.webbaseline.pro](https://forum.webbaseline.pro)
- **Issue Tracker**: [GitHub Issues](https://github.com/daxp472/WebBaseline-Pro/issues)

## 📄 License

These examples are provided under the MIT License. See [LICENSE](../../LICENSE) for details.