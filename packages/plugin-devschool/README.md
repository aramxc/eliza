# @elizaos/plugin-devschool

A plugin demonstrating how to build custom actions and providers for ElizaOS agents, created as part of the [AI Agent Dev School 2](https://www.youtube.com/watch?v=XenGeAcPAQo) tutorial series.

## Description

The News plugin showcases how to build custom actions and providers in the ElizaOS framework. It implements a news fetching system using the NewsAPI service and demonstrates core plugin development concepts.

## Installation

```bash
pnpm install @elizaos/plugin-news
```

## Features

### 1. News Actions

- CURRENT_NEWS action for fetching latest news
- Configurable search terms
- Integration with NewsAPI
- Automatic news summary generation

### 2. News Provider

- Manages news article caching
- Handles API rate limiting
- Provides formatted news responses
- Maintains search history

## Implementation Details

### News Action

The plugin implements a `CURRENT_NEWS` action that:
- Accepts user queries for news topics
- Connects to the NewsAPI endpoint (https://newsapi.org/v2)
- Returns formatted news summaries
- Stores results in agent memory

Example usage:
```typescript
// User query examples
"What's the latest news about Bitcoin?"
"Can you show me current Bitcoin news?"
"Tell me what's happening with Bitcoin"
```

### Provider Implementation

The news provider demonstrates:
- State management
- API integration
- Response formatting
- Memory storage patterns

## Development

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the plugin:

```bash
pnpm run build
```

4. Run linting:

```bash
pnpm run lint
```

## Dependencies

- @elizaos/core: workspace:\*

## Future Enhancements

1. **Enhanced Conversation Management**

    - Advanced context tracking
    - Multi-thread conversation support
    - Conversation state persistence
    - Improved conversation flow control
    - Natural language understanding improvements

2. **Advanced Room Control**

    - Dynamic room creation and management
    - Room permission system
    - Advanced moderation tools
    - Room analytics and insights
    - Cross-room communication features

3. **Expanded Fact Management**

    - Enhanced fact verification system
    - Fact relationship mapping
    - Automated fact updating
    - Fact confidence scoring
    - Cross-reference system
    - Fact expiration management

4. **Goal System Improvements**

    - Multi-step goal planning
    - Goal dependency tracking
    - Progress visualization
    - Goal priority management
    - Automated milestone tracking
    - Goal optimization suggestions

5. **Provider Enhancements**

    - Improved boredom detection
    - Advanced engagement metrics
    - Enhanced fact retrieval algorithms
    - Real-time status updates
    - Provider performance analytics

6. **Memory Management**

    - Enhanced memory prioritization
    - Memory compression techniques
    - Long-term memory storage
    - Memory relationship mapping
    - Context-aware recall

7. **Developer Tools**

    - Enhanced debugging capabilities
    - Testing framework improvements
    - Plugin development templates
    - Documentation generator
    - Performance profiling tools

8. **Integration Features**
    - Enhanced plugin interoperability
    - External service connectors
    - API gateway integration
    - Webhook system improvements
    - Third-party platform support

We welcome community feedback and contributions to help prioritize these enhancements.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Credits

Special thanks to:

- The Eliza Core development team
- The Eliza community for their contributions and feedback

## License

This plugin is part of the Eliza project. See the main project repository for license information.
