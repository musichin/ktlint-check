import {expect, it, describe} from '@jest/globals';
import {buildArguments} from '../src/linter';
import {Options} from '../src/types';

describe('#linter', () => {
  describe('#buildArguments', () => {
    it('empty arguments', () => {
      const options: Options = {};
      const args = buildArguments(options);
      expect(args.length).toStrictEqual(0);
    });
    it('all arguments', () => {
      const options: Options = {
        android: true,
        disabledRules: ['testRule'],
        format: true,
        limit: 10,
        relative: true,
        reporter: ['testReporter'],
        ruleset: 'testRuleset',
        editorconfig: 'testEditorconfig',
        experimental: true,
        baseline: 'testBaseline',
        patterns: ['testPattern'],
      };
      const args = buildArguments(options);

      expect(args).toContain('--android');
      expect(args).toContain('--disabled_rules=testRule');
      expect(args).toContain('--format');
      expect(args).toContain('--limit=10');
      expect(args).toContain('--relative');
      expect(args).toContain('--reporter=testReporter');
      expect(args).toContain('--ruleset=testRuleset');
      expect(args).toContain('--editorconfig=testEditorconfig');
      expect(args).toContain('--experimental');
      expect(args).toContain('--baseline=testBaseline');
      expect(args).toContain('testPattern');
      expect(args.length).toStrictEqual(11);
    });
  });
});