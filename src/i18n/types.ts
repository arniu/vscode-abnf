export interface Messages {
  // 核心规则描述
  coreRules: {
    [key: string]: {
      description: string;
      definition: string;
    };
  };

  // 用户界面消息
  ui: {
    hover: {
      coreRuleTitle: string;
      userRuleTitle: string;
      userRuleHint: string;
      source: string;
      definition: string;
      sourceLabel: string;
    };
    rename: {
      invalidRuleName: string;
      ruleNotDefined: string;
      renameFailed: string;
    };
    format: {
      formatDocument: string;
    };
    general: {
      abnfRule: string;
    };
  };
}
