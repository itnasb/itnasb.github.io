hljs.registerLanguage('bcheck', (hljs) => {
    // DSL keywords you want in Burp orange
    const KEYWORD = {
        scope: 'keyword',
        begin: /\b(continue|name|define|given|then|if|else|end|send|payload|replacing|report|issue|matches|contains|and|or|not|severity|confidence|detail|remediation|query|insertion|point|appending)\b/
    };

    // Parentheses white
    const PUNCT = { scope: 'punctuation', begin: /[()]/ };

    // Braced expressions: {regex_replace(...)}
    const BRACED = {
        begin: /\{/,
        end: /\}/,
        beginScope: 'punctuation', // { white
        endScope: 'punctuation',   // } white
        contains: [
            KEYWORD,
            PUNCT,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            { scope: 'variable', begin: /[A-Za-z_][A-Za-z0-9_.]*/ },
            { scope: 'number', begin: /\b\d+\b/ }
        ]
    };

    // Backticks stay green, but allow {rand6} inside with white braces
    const BT = {
        scope: 'string',
        begin: /`/,
        end: /`/,
        contains: [BRACED]
    };

    // ----- METADATA block handling -----
    // Keys inside metadata block (indented)
    const META_KEY = {
        scope: 'attr',
        begin: /^[ \t]+[A-Za-z_][A-Za-z0-9_-]*(?=\s*:)/m
    };

    // Values inside metadata block: everything after ": " is a string (single line)
    const META_VALUE = {
        begin: /:\s+(?=\S)/,
        end: /$/,
        excludeBegin: true,
        scope: 'string'
    };

    const METADATA_BLOCK = {
        scope: 'attr',
        begin: /^metadata:\s*$/m,
        end: /^(?=\S)/m,     // next top-level line (non-indented)
        excludeEnd: true,
        contains: [
            { scope: 'attr', begin: /^metadata(?=:)/m }, // style "metadata" itself as a key
            META_KEY,
            META_VALUE,
            hljs.HASH_COMMENT_MODE
        ]
    };

    // Top-level YAML-ish keys outside metadata (optional)
    const TOP_KEY = {
        scope: 'attr',
        begin: /^[A-Za-z_][A-Za-z0-9_-]*(?=\s*:)/m
    };

    return {
        name: 'BCheck',
        contains: [
            METADATA_BLOCK, // must come before TOP_KEY so metadata gets special treatment
            TOP_KEY,
            KEYWORD,
            BRACED,
            BT,
            PUNCT,
            hljs.C_LINE_COMMENT_MODE,
            hljs.HASH_COMMENT_MODE
        ]
    };
});