export declare const rules: {
    'layer-imports': import("eslint").Rule.RuleModule;
    'path-checker': import("eslint").Rule.RuleModule;
    'public-api-imports': import("eslint").Rule.RuleModule;
};
declare const plugin: {
    configs: {
        recommended: {
            plugins: string[];
            rules: {
                'path-checher-ulbi-example/layer-imports': string;
                'path-checher-ulbi-example/path-checker': string;
                'path-checher-ulbi-example/public-api-imports': string;
            };
        };
    };
    rules: {
        'layer-imports': import("eslint").Rule.RuleModule;
        'path-checker': import("eslint").Rule.RuleModule;
        'public-api-imports': import("eslint").Rule.RuleModule;
    };
};
export default plugin;
