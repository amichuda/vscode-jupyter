// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { assert } from 'chai';
import { IJupyterSettings } from '../../client/common/types';
import { CellMatcher } from '../../client/datascience/cellMatcher';
import { defaultDataScienceSettings } from './helpers';

suite('DataScience Python CellMatcher', () => {
    test('CellMatcher', () => {
        const settings: IJupyterSettings = defaultDataScienceSettings();
        const matcher1 = new CellMatcher('python', settings);
        assert.ok(matcher1.isCode('# %%'), 'Base code is wrong');
        assert.ok(matcher1.isMarkdown('# %% [markdown]'), 'Base markdown is wrong');
        assert.equal(matcher1.exec('# %% TITLE'), 'TITLE', 'Title not found');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settings.codeLensExpressions.forEach((t) => (t.defaultCellMarker = '# %% CODE HERE'));
        const matcher2 = new CellMatcher('python', settings);
        assert.ok(matcher2.isCode('# %%'), 'Code not found');
        assert.ok(matcher2.isCode('# %% CODE HERE'), 'Code not found');
        assert.ok(matcher2.isCode('# %% CODE HERE TOO'), 'Code not found');
        assert.ok(matcher2.isMarkdown('# %% [markdown]'), 'Base markdown is wrong');
        assert.equal(matcher2.exec('# %% CODE HERE'), '', 'Should not have a title');
        assert.equal(matcher2.exec('# %% CODE HERE FOO'), 'FOO', 'Should have a title');
    });
});

suite('DataScience Markdown CellMatcher', () => {
    test('CellMatcher', () => {
        const settings: IJupyterSettings = defaultDataScienceSettings();
        const matcher1 = new CellMatcher('markdown', settings);
        assert.ok(matcher1.isCode('```python'), 'Base code is wrong');
        assert.ok(matcher1.isMarkdown('```'), 'Base markdown is wrong');
        assert.equal(matcher1.exec('```python TITLE'), 'TITLE', 'Title not found');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settings.codeLensExpressions.forEach((t) => (t.defaultCellMarker = '```python CODE HERE'));
        const matcher2 = new CellMatcher('markdown', settings);
        assert.ok(matcher2.isCode('```python'), 'Code not found');
        assert.ok(matcher2.isCode('```python CODE HERE'), 'Code not found');
        assert.ok(matcher2.isCode('```python CODE HERE TOO'), 'Code not found');
        assert.ok(matcher2.isMarkdown('```'), 'Base markdown is wrong');
        assert.equal(matcher2.exec('```python CODE HERE'), '', 'Should not have a title');
        assert.equal(matcher2.exec('```python CODE HERE FOO'), 'FOO', 'Should have a title');
    });
});
