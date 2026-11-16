(function attachPortalApp(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AgentToolbeltApp = factory();
    if (root.document) {
      const start = () => root.AgentToolbeltApp.init(root.AGENT_TOOLBELT_DATA);
      if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', start);
      else start();
    }
  }
}(typeof globalThis === 'object' ? globalThis : this, function createPortalApp() {
  'use strict';

  const categoryVisuals = {
    'Discovery & Planning': { tone: 'violet', path: 'M9 17h6v-2a6 6 0 1 0-6 0v2Zm0 2h6m-5 3h4' },
    'Feature Delivery': { tone: 'blue', path: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14' },
    'Debugging & Repair': { tone: 'orange', path: 'M8 8h8v7a4 4 0 0 1-8 0V8Zm2-3h4l2 3H8l2-3ZM3 11h5m8 0h5M3 16h5m8 0h5M6 3l3 3m9-3-3 3M12 8v11' },
    'Review & Quality': { tone: 'indigo', path: 'M21 11v1a9 9 0 1 1-5.3-8.2M8 11l4 4L22 5' },
    'Security & Risk': { tone: 'rose', path: 'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6' },
    'Codebase Improvement': { tone: 'lime', path: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5' },
    'Testing & Verification': { tone: 'cyan', path: 'M9 3h6m-5 0v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3M8 14h8' },
    'Agent Operations': { tone: 'slate', path: 'M4 4h16v16H4zM7 8l3 3-3 3m6 1h4' }
  };

  // Each workflow has its own icon and tone. A workflow with no entry uses the category of its first stage.
  const workflowVisuals = {
    'product-learning': { tone: 'violet', path: categoryVisuals['Discovery & Planning'].path },
    'feature-delivery': { tone: 'blue', path: categoryVisuals['Feature Delivery'].path },
    'feature-refinement': { tone: 'indigo', path: 'M4 6h9M4 12h9M4 18h6m6-11 2 2 3-4m-5 9 2 2 3-4' },
    'risk-based-testing': { tone: 'cyan', path: categoryVisuals['Testing & Verification'].path },
    'bug-fixing': { tone: 'orange', path: categoryVisuals['Debugging & Repair'].path },
    'pr-review': { tone: 'slate', path: categoryVisuals['Review & Quality'].path },
    'codebase-improvement': { tone: 'lime', path: categoryVisuals['Codebase Improvement'].path },
    'security-sensitive-change': { tone: 'rose', path: categoryVisuals['Security & Risk'].path },
    'production-readiness': { tone: 'magenta', path: 'M3 12h4l3-8 4 16 3-8h4' },
    'incident-follow-up': { tone: 'orange', path: 'M12 4 2.5 20h19L12 4Zm0 6v4m0 3v.5' },
    'idea-to-release': { tone: 'blue', path: 'M5 21V4m0 1h12l-2.5 4 2.5 4H5' }
  };

  const roleTones = {
    'QA and test': 'cyan',
    Developer: 'blue',
    Product: 'violet',
    'Architecture, SRE, and security': 'rose',
    'Tech lead': 'indigo',
    'Platform and operators': 'slate',
    'UI and front end': 'magenta',
    Writers: 'orange',
    'End-to-end journeys': 'lime'
  };

  // Hashes of the earlier one-page portal, and the page that now holds each section.
  const movedSections = {
    workflows: 'workflows.html',
    'start-here': 'workflows.html',
    'use-cases': 'use-cases.html',
    hosts: 'setup.html',
    capabilities: 'setup.html#capabilities'
  };

  function normalizeText(value) {
    return String(value == null ? '' : value).toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function skillSearchText(skill) {
    return normalizeText([
      skill.id,
      skill.display_name,
      skill.description,
      skill.short_description,
      skill.category,
      skill.primary_purpose,
      skill.preferred_context,
      ...(skill.tags || []),
      ...(skill.use_when || []),
      ...(skill.avoid_when || []),
      ...(skill.expected_outputs || []),
      ...(skill.example_prompts || [])
    ].join(' '));
  }

  function filterSkills(skills, options) {
    const settings = options || {};
    const query = normalizeText(settings.query);
    const terms = query ? query.split(' ') : [];
    const category = settings.category && settings.category !== 'all' ? settings.category : '';
    const tags = (settings.tags || []).map(normalizeText).filter(Boolean);
    return (skills || []).filter((skill) => {
      if (category && skill.category !== category) return false;
      if (tags.length && !tags.every((tag) => (skill.tags || []).map(normalizeText).includes(tag))) return false;
      const searchable = skillSearchText(skill);
      return terms.every((term) => searchable.includes(term));
    });
  }

  function parseHash(hash) {
    const value = String(hash || '').replace(/^#/, '');
    if (!value) return { type: 'start', id: null };
    const separator = value.indexOf('=') >= 0 ? '=' : '/';
    const split = value.split(separator);
    const type = split[0];
    const id = split.slice(1).join(separator);
    if (type === 'skill' || type === 'workflow') return { type, id: decodeURIComponent(id) };
    return { type: value, id: null };
  }

  function serializeHash(type, id) {
    return `#${type}/${encodeURIComponent(id)}`;
  }

  function invocationFor(host, skillId) {
    const template = typeof host === 'string' ? host : host && host.invocation_template;
    if (!template) return String(skillId || '');
    return template.replace(/\{skill_id\}/g, String(skillId || ''));
  }

  function clearFilters() {
    return { query: '', category: 'all', tags: [] };
  }

  function categorySkillIds(skills, category) {
    return (skills || []).filter((skill) => skill.category === category).map((skill) => skill.id);
  }

  function categoryBucketState(currentCategory, nextCategory, categories) {
    if (!Array.isArray(categories) || !categories.includes(nextCategory)) return currentCategory || null;
    return currentCategory === nextCategory ? null : nextCategory;
  }

  function themeState(savedTheme, prefersDark) {
    const theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (prefersDark ? 'dark' : 'light');
    const isDark = theme === 'dark';
    return {
      theme,
      isDark,
      buttonText: isDark ? 'Light mode' : 'Dark mode',
      ariaLabel: isDark ? 'Use light theme' : 'Use dark theme'
    };
  }

  function init(data, documentOverride) {
    const documentRef = documentOverride || (typeof document !== 'undefined' ? document : null);
    if (!data || !documentRef) return null;
    const state = { ...clearFilters(), expandedCategory: null, workflow: null };
    const byId = (id) => documentRef.getElementById(id);
    const page = documentRef.body.dataset.page || 'index';
    const on = (id, type, handler) => { const element = byId(id); if (element) element.addEventListener(type, handler); };
    const setText = (id, text) => { const element = byId(id); if (element) element.textContent = text; };
    const skillById = new Map(data.skills.map((skill) => [skill.id, skill]));
    const workflowById = new Map(data.workflows.map((workflow) => [workflow.id, workflow]));
    const dialog = byId('skill-dialog');
    let dialogReturnFocus = null;

    function createElement(tag, className, text) {
      const element = documentRef.createElement(tag);
      if (className) element.className = className;
      if (text != null) element.textContent = text;
      return element;
    }

    function applyCategory(element, category) {
      element.dataset.categoryTone = (categoryVisuals[category] || categoryVisuals['Agent Operations']).tone;
    }

    function iconElement(iconPath) {
      const wrapper = createElement('span', 'category-icon');
      wrapper.setAttribute('aria-hidden', 'true');
      // The paths are constants in this file. The parser gives the elements the SVG namespace.
      wrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPath}"/></svg>`;
      return wrapper;
    }

    function categoryIcon(category) {
      return iconElement((categoryVisuals[category] || categoryVisuals['Agent Operations']).path);
    }

    function workflowVisual(workflow) {
      if (workflowVisuals[workflow.id]) return workflowVisuals[workflow.id];
      const firstSkill = skillById.get(workflow.stages[0].skill);
      return categoryVisuals[firstSkill && firstSkill.category] || categoryVisuals['Agent Operations'];
    }

    // One dot for each stage, in the color of the stage category.
    function stageDots(workflow) {
      const dots = createElement('span', 'stage-dots');
      dots.setAttribute('aria-hidden', 'true');
      workflow.stages.forEach((stage) => {
        const dot = createElement('span', 'stage-dot');
        const skill = skillById.get(stage.skill);
        if (skill) applyCategory(dot, skill.category);
        dots.appendChild(dot);
      });
      return dots;
    }

    function skillChip(skillId) {
      const skill = skillById.get(skillId);
      const button = createElement('button', 'skill-chip');
      button.type = 'button';
      button.dataset.openSkill = skillId;
      if (skill) applyCategory(button, skill.category);
      const dot = createElement('span', 'tone-dot');
      dot.setAttribute('aria-hidden', 'true');
      button.append(dot, createElement('span', '', skill ? skill.display_name : skillId));
      return button;
    }

    function renderTaskShortcuts() {
      const target = byId('task-shortcuts');
      if (!target) return;
      target.replaceChildren();
      const groups = [
        {
          id: 'explore-plan',
          title: 'Explore and plan',
          tasks: [
            { skill: 'user-research-synthesis', title: 'Understand customers', hint: 'Connect research to evidence' },
            { skill: 'product-discovery', title: 'Plan a feature', hint: 'Clarify the problem' },
            { skill: 'system-design', title: 'Design a system', hint: 'Document design and threats' }
          ]
        },
        {
          id: 'improve-verify',
          title: 'Improve and verify',
          tasks: [
            { skill: 'bug-to-fix', title: 'Fix a bug', hint: 'Find the root cause' },
            { skill: 'tech-debt-discovery', title: 'Find technical debt', hint: 'Choose useful improvements' },
            { skill: 'pr-review', title: 'Review a PR', hint: 'Check a change' }
          ]
        }
      ];
      groups.forEach((group) => {
        const section = createElement('section', 'task-group');
        section.dataset.taskGroup = group.id;
        const heading = createElement('h3', 'task-group-title', group.title);
        heading.id = `task-group-${group.id}`;
        section.setAttribute('aria-labelledby', heading.id);
        section.appendChild(heading);
        const choices = createElement('div', 'task-shortcuts');
        group.tasks.forEach((task) => {
          const skill = skillById.get(task.skill);
          if (!skill) return;
          const button = createElement('button', 'task-shortcut');
          button.type = 'button';
          button.dataset.openSkill = skill.id;
          applyCategory(button, skill.category);
          const identity = createElement('span', 'task-identity');
          identity.append(categoryIcon(skill.category), createElement('span', 'task-category', skill.category));
          button.appendChild(identity);
          button.appendChild(createElement('strong', '', task.title));
          button.appendChild(createElement('span', 'task-hint', task.hint));
          const arrow = createElement('span', 'task-arrow', '↗');
          arrow.setAttribute('aria-hidden', 'true');
          button.appendChild(arrow);
          choices.appendChild(button);
        });
        section.appendChild(choices);
        target.appendChild(section);
      });
    }

    function addList(parent, values, className) {
      const list = createElement('ul', className);
      values.forEach((value) => list.appendChild(createElement('li', '', value)));
      parent.appendChild(list);
      return list;
    }

    function renderHosts() {
      setText('skill-count', data.skills.length);
      setText('plugin-skill-count', data.skills.length);
      setText('workflow-count', data.workflows.length);
      setText('host-count', data.hosts.length);
      const hosts = byId('hero-hosts');
      if (!hosts) return;
      hosts.replaceChildren();
      data.hosts.forEach((host) => {
        const row = createElement('div', 'host-pill');
        row.append(createElement('span', 'host-pill-name', host.name), createElement('code', 'host-pill-use', invocationFor(host, 'skill-name')));
        hosts.appendChild(row);
      });
    }

    // A terminal-style Copy button. The status span gives screen readers the result.
    function installCopyButton(host) {
      const button = createElement('button', 'install-copy');
      button.type = 'button';
      button.dataset.copyText = host.local_install_commands.join('\n');
      button.appendChild(createElement('span', 'install-copy-label', 'Copy'));
      const status = createElement('span', 'copy-status');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      button.appendChild(status);
      button.setAttribute('aria-label', `Copy ${host.name} install commands`);
      return button;
    }

    function renderHeroInstall() {
      const target = byId('hero-install');
      if (!target) return;
      target.replaceChildren();
      const bar = createElement('div', 'install-bar');
      const tabs = createElement('div', 'install-tabs');
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Install commands by agent host');
      const panel = createElement('div', 'install-panel');
      panel.id = 'hero-install-panel';
      panel.setAttribute('role', 'tabpanel');
      const copySlot = createElement('span');
      const tabButtons = data.hosts.map((host) => {
        const tab = createElement('button', 'install-tab', host.name);
        tab.type = 'button';
        tab.id = `hero-install-tab-${host.id}`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        tab.dataset.installHost = host.id;
        tabs.appendChild(tab);
        return tab;
      });
      const select = (index, focus) => {
        const host = data.hosts[index];
        tabButtons.forEach((tab, tabIndex) => {
          const selected = tabIndex === index;
          tab.setAttribute('aria-selected', String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        if (focus) tabButtons[index].focus();
        panel.setAttribute('aria-labelledby', tabButtons[index].id);
        panel.replaceChildren(...host.local_install_commands.map((command) => createElement('code', 'install-line', command)));
        panel.querySelectorAll('.install-line').forEach((line) => {
          const prompt = createElement('span', 'install-prompt', '$');
          prompt.setAttribute('aria-hidden', 'true');
          line.prepend(prompt);
        });
        copySlot.replaceChildren(installCopyButton(host));
      };
      tabs.addEventListener('click', (event) => {
        const tab = event.target.closest('[data-install-host]');
        if (tab) select(tabButtons.indexOf(tab), false);
      });
      tabs.addEventListener('keydown', (event) => {
        const current = tabButtons.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
        const last = tabButtons.length - 1;
        const next = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current === 0 ? last : current - 1, Home: 0, End: last }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(next, true);
      });
      bar.append(tabs, copySlot);
      target.append(bar, panel);
      select(0, false);
    }

    function renderHostSetup() {
      const target = byId('host-setup-list');
      if (!target) return;
      target.replaceChildren();
      data.hosts.forEach((host) => {
        const card = createElement('article', 'host-setup-card');
        card.appendChild(createElement('p', 'eyebrow', host.name));
        card.appendChild(createElement('h3', '', host.installation));
        card.appendChild(createElement('p', 'host-browser-note', host.browser_hint));
        const commandList = createElement('div', 'host-command-list');
        host.local_install_commands.forEach((command) => {
          const commandRow = createElement('code', 'host-command', command);
          commandList.appendChild(commandRow);
        });
        commandList.appendChild(installCopyButton(host));
        card.appendChild(commandList);
        const invocation = createElement('p', 'host-invocation-note');
        invocation.appendChild(createElement('span', '', 'Try a skill: '));
        invocation.appendChild(createElement('code', '', invocationFor(host, 'skill-name')));
        card.appendChild(invocation);
        target.appendChild(card);
      });
    }

    function renderStartHere() {
      const target = byId('start-here-list');
      if (!target) return;
      target.replaceChildren();
      data.workflows.forEach((workflow) => {
        const link = createElement('a', 'start-card');
        link.href = serializeHash('workflow', workflow.id);
        const visual = workflowVisual(workflow);
        link.dataset.categoryTone = visual.tone;
        const top = createElement('div');
        top.appendChild(iconElement(visual.path));
        top.appendChild(createElement('h2', '', workflow.name));
        top.appendChild(createElement('p', '', workflow.purpose));
        link.appendChild(top);
        const footer = createElement('span', 'start-card-footer');
        footer.append(stageDots(workflow), createElement('span', 'start-card-count', `${workflow.stages.length} stages →`));
        link.appendChild(footer);
        target.appendChild(link);
      });
    }

    function makeChip(label, value, group, pressed) {
      const chip = createElement('button', 'chip');
      if (group === 'category' && value !== 'all') {
        applyCategory(chip, value);
        chip.appendChild(categoryIcon(value));
      }
      chip.appendChild(createElement('span', 'filter-name', label));
      chip.type = 'button';
      chip.dataset.filterGroup = group;
      chip.dataset.filterValue = value;
      chip.setAttribute('aria-pressed', String(pressed));
      if (group === 'category') {
        const count = value === 'all' ? data.skills.length : categorySkillIds(data.skills, value).length;
        const badge = createElement('span', 'filter-count', String(count));
        badge.setAttribute('aria-hidden', 'true');
        chip.appendChild(badge);
      }
      return chip;
    }

    function renderCategoryBuckets() {
      const target = byId('category-buckets');
      target.replaceChildren();
      data.categories.forEach((category) => {
        const button = createElement('button', 'category-bucket');
        button.type = 'button';
        button.dataset.categoryBucket = category;
        applyCategory(button, category);
        button.appendChild(categoryIcon(category));
        button.setAttribute('aria-expanded', String(state.expandedCategory === category));
        button.setAttribute('aria-controls', 'category-bucket-panel');
        button.appendChild(createElement('span', 'category-bucket-count', `${categorySkillIds(data.skills, category).length} skills`));
        button.appendChild(createElement('h3', '', category));
        button.appendChild(createElement('p', '', data.category_guidance[category]));
        button.appendChild(createElement('span', 'category-bucket-action', state.expandedCategory === category ? 'Hide skills ↑' : 'Show skills →'));
        target.appendChild(button);
      });
    }

    function renderCategoryBucketPanel() {
      const panel = byId('category-bucket-panel');
      const title = byId('category-bucket-panel-title');
      const description = byId('category-bucket-panel-description');
      const target = byId('category-bucket-skills');
      const category = state.expandedCategory;
      const isOpen = Boolean(category && data.categories.includes(category));
      panel.hidden = !isOpen;
      target.replaceChildren();
      if (!isOpen) return;
      const matches = filterSkills(data.skills, { ...state, category });
      title.textContent = category;
      description.textContent = `${data.category_guidance[category]} ${matches.length} skill${matches.length === 1 ? '' : 's'} shown${state.query ? ' for this search' : ''}.`;
      matches.forEach((skill) => {
        const card = createElement('article', 'category-skill-card');
        applyCategory(card, skill.category);
        card.appendChild(createElement('h4', '', skill.display_name));
        card.appendChild(createElement('p', 'skill-id', skill.id));
        card.appendChild(createElement('p', '', skill.short_description));
        const open = createElement('button', 'card-open', 'View details →');
        open.type = 'button';
        open.dataset.openSkill = skill.id;
        card.appendChild(open);
        target.appendChild(card);
      });
      if (!matches.length) target.appendChild(createElement('p', 'category-empty', 'No skills in this bucket match the current search or filters.'));
    }

    function renderFilters() {
      const categories = byId('category-filters');
      categories.replaceChildren();
      categories.appendChild(makeChip('All', 'all', 'category', state.category === 'all'));
      data.categories.forEach((category) => categories.appendChild(makeChip(category, category, 'category', state.category === category)));

      const tags = byId('tag-filters');
      tags.replaceChildren();
      data.discovery_tags.forEach((tag) => tags.appendChild(makeChip(`#${tag}`, tag, 'tag', state.tags.includes(tag))));
    }

    function renderSkillCard(skill) {
      const card = createElement('article', 'skill-card');
      card.dataset.skillId = skill.id;
      applyCategory(card, skill.category);
      const head = createElement('div', 'skill-card-head');
      head.appendChild(categoryIcon(skill.category));
      const category = createElement('span', 'skill-card-category', skill.category);
      head.appendChild(category);
      if (skill.documentation_completeness.status === 'specialized') head.appendChild(createElement('span', 'specialized-badge', 'Specialized'));
      card.appendChild(head);
      // The title button covers the whole card, so the card is one target.
      const title = createElement('h3');
      const open = createElement('button', 'card-open', skill.display_name);
      open.type = 'button';
      open.dataset.openSkill = skill.id;
      title.appendChild(open);
      card.appendChild(title);
      card.appendChild(createElement('p', 'skill-id', skill.id));
      card.appendChild(createElement('p', 'skill-purpose', skill.short_description));
      const output = createElement('div', 'skill-output');
      output.appendChild(createElement('span', 'output-label', 'Result'));
      const outputs = skill.expected_outputs || [];
      output.appendChild(createElement('p', '', outputs[outputs.length - 1] || skill.primary_purpose));
      card.appendChild(output);
      return card;
    }

    function renderSkills() {
      const results = filterSkills(data.skills, state);
      const grid = byId('skills-grid');
      const empty = byId('empty-state');
      grid.replaceChildren();
      results.forEach((skill) => grid.appendChild(renderSkillCard(skill)));
      empty.hidden = results.length !== 0;
      const summary = byId('result-summary');
      summary.textContent = results.length === data.skills.length && !state.query && state.category === 'all' && !state.tags.length
        ? `Showing all ${data.skills.length} skills`
        : `${results.length} skill${results.length === 1 ? '' : 's'} match your filters`;
      const clearSearch = byId('clear-search');
      clearSearch.hidden = !state.query;
    }

    function renderWorkflow(workflow) {
      const article = createElement('article', 'workflow-card');
      article.id = `workflow-${workflow.id}`;
      const visual = workflowVisual(workflow);
      article.dataset.categoryTone = visual.tone;
      const firstSkill = skillById.get(workflow.stages[0].skill);
      const header = createElement('div', 'workflow-card-header');
      header.appendChild(iconElement(visual.path));
      const headerCopy = createElement('div', 'workflow-heading');
      const heading = createElement('h2', '', workflow.name);
      heading.id = `workflow-title-${workflow.id}`;
      heading.tabIndex = -1;
      article.setAttribute('aria-labelledby', heading.id);
      headerCopy.append(heading, createElement('p', '', workflow.purpose));
      header.appendChild(headerCopy);
      const meta = createElement('div', 'workflow-meta');
      const count = createElement('span', 'workflow-count');
      count.append(stageDots(workflow), createElement('span', '', `${workflow.stages.length} stages`));
      meta.appendChild(count);
      if (firstSkill) {
        const first = createElement('button', 'workflow-start', 'View first skill →');
        first.type = 'button';
        first.dataset.openSkill = firstSkill.id;
        meta.appendChild(first);
      }
      header.appendChild(meta);
      article.appendChild(header);
      const stages = createElement('ol', 'workflow-stages');
      stages.setAttribute('role', 'list');
      stages.setAttribute('aria-label', `${workflow.name} stages`);
      workflow.stages.forEach((stage, index) => {
        const stageElement = createElement('li', 'workflow-stage');
        const skill = skillById.get(stage.skill);
        if (skill) applyCategory(stageElement, skill.category);
        const number = createElement('span', 'stage-number', String(index + 1));
        number.setAttribute('aria-hidden', 'true');
        stageElement.appendChild(number);

        const main = createElement('div', 'stage-main');
        const title = createElement('h3', 'stage-title');
        const stageButton = createElement('button', 'stage-skill', skill ? skill.display_name : stage.skill);
        stageButton.type = 'button';
        stageButton.dataset.openSkill = stage.skill;
        stageButton.id = `${workflow.id}-stage-${index + 1}`;
        title.appendChild(stageButton);
        stageElement.setAttribute('aria-labelledby', stageButton.id);
        main.appendChild(title);
        if (skill) {
          const identity = createElement('div', 'stage-identity');
          identity.append(categoryIcon(skill.category), createElement('span', 'stage-category', skill.category));
          main.appendChild(identity);
        }
        main.appendChild(createElement('p', 'stage-rationale', stage.rationale));
        stageElement.appendChild(main);

        const aside = createElement('div', 'stage-aside');
        if (skill && skill.expected_outputs.length) {
          const output = createElement('div', 'stage-output');
          output.append(createElement('span', 'stage-label', 'Output'), createElement('p', '', skill.expected_outputs[0]));
          aside.appendChild(output);
        }
        const prompt = createElement('details', 'stage-prompt');
        prompt.appendChild(createElement('summary', '', 'Example prompt'));
        prompt.appendChild(createElement('p', 'stage-example', stage.example_invocation));
        aside.appendChild(prompt);
        // The timeline already shows the following stage; list only branches and exits.
        const followingSkill = workflow.stages[index + 1] && workflow.stages[index + 1].skill;
        const branches = stage.next_steps.filter((nextId) => nextId !== followingSkill);
        if (branches.length) {
          const handoff = createElement('div', 'stage-handoff');
          handoff.appendChild(createElement('span', 'stage-label', followingSkill ? 'Can also lead to' : 'After this workflow'));
          const next = createElement('div', 'stage-next');
          branches.forEach((nextId) => {
            const nextButton = createElement('button', 'next-link');
            nextButton.type = 'button';
            nextButton.dataset.openSkill = nextId;
            nextButton.appendChild(createElement('span', '', skillById.has(nextId) ? skillById.get(nextId).display_name : nextId));
            const arrow = createElement('span', 'next-arrow', '→');
            arrow.setAttribute('aria-hidden', 'true');
            nextButton.appendChild(arrow);
            next.appendChild(nextButton);
          });
          handoff.appendChild(next);
          aside.appendChild(handoff);
        }
        stageElement.appendChild(aside);
        stages.appendChild(stageElement);
      });
      article.appendChild(stages);
      return article;
    }

    // The workflows page shows the index of all workflows, or one workflow with a rail of the others.
    function renderWorkflowView() {
      const index = byId('start-here-list');
      const detail = byId('workflow-detail');
      if (!index || !detail) return;
      const workflow = workflowById.get(state.workflow);
      index.hidden = Boolean(workflow);
      detail.hidden = !workflow;
      if (!workflow) return;
      const rail = byId('workflow-rail-list');
      rail.replaceChildren();
      data.workflows.forEach((entry) => {
        const link = createElement('a', 'workflow-rail-link');
        link.href = serializeHash('workflow', entry.id);
        const visual = workflowVisual(entry);
        link.dataset.categoryTone = visual.tone;
        if (entry.id === workflow.id) link.setAttribute('aria-current', 'true');
        link.append(iconElement(visual.path), createElement('span', '', entry.name));
        rail.appendChild(link);
      });
      byId('workflow-list').replaceChildren(renderWorkflow(workflow));
    }

    function renderUseCases() {
      const list = byId('use-case-list');
      const chips = byId('use-case-groups');
      if (!list || !chips) return;
      const useCases = data.use_cases || [];
      const groups = [...new Set(useCases.map((useCase) => useCase.group))];
      let active = null;
      function draw() {
        list.replaceChildren();
        groups.filter((group) => !active || group === active).forEach((group, groupIndex) => {
          const cases = useCases.filter((useCase) => useCase.group === group);
          const section = createElement('section', 'use-case-section');
          section.dataset.categoryTone = roleTones[group] || 'slate';
          const heading = createElement('h2', 'use-case-group');
          heading.id = `use-case-group-${groupIndex}`;
          section.setAttribute('aria-labelledby', heading.id);
          const dot = createElement('span', 'tone-dot');
          dot.setAttribute('aria-hidden', 'true');
          heading.append(dot, createElement('span', 'use-case-group-name', group), createElement('span', 'filter-count', String(cases.length)));
          section.appendChild(heading);
          const grid = createElement('div', 'use-case-grid');
          cases.forEach((useCase) => {
            const card = createElement('article', 'use-case-card');
            card.id = `use-case-${useCase.slug}`;
            const title = createElement('h3');
            const link = createElement('a', '', useCase.title);
            link.href = useCase.source_url;
            link.target = '_blank';
            link.rel = 'noopener';
            title.appendChild(link);
            card.appendChild(title);
            // Show who the page is for, then what the reader gets, so the cards scan in the same order.
            const sentences = (useCase.summary || '').split(/(?<=\.)\s+(?=[A-Z])/);
            const outcome = sentences.slice(1).find((sentence) => /^You (get|finish with)\b/.test(sentence));
            if (outcome && /^This page is for /.test(sentences[0])) {
              card.appendChild(createElement('p', 'use-case-summary', sentences[0].replace(/^This page is for /, 'For ')));
              card.appendChild(createElement('p', 'use-case-outcome', outcome));
            } else if (useCase.summary) {
              card.appendChild(createElement('p', 'use-case-summary', useCase.summary));
            }
            const skills = createElement('div', 'detail-related use-case-skills');
            useCase.skills.forEach((skillId) => skills.appendChild(skillChip(skillId)));
            card.appendChild(skills);
            grid.appendChild(card);
          });
          section.appendChild(grid);
          list.appendChild(section);
        });
      }
      chips.replaceChildren();
      [null, ...groups].forEach((group) => {
        const chip = createElement('button', 'chip');
        chip.type = 'button';
        if (group) {
          chip.dataset.categoryTone = roleTones[group] || 'slate';
          const dot = createElement('span', 'tone-dot');
          dot.setAttribute('aria-hidden', 'true');
          chip.appendChild(dot);
        }
        chip.appendChild(createElement('span', '', group || 'All roles'));
        chip.setAttribute('aria-pressed', String(group === active));
        chip.addEventListener('click', () => {
          active = group;
          chips.querySelectorAll('.chip').forEach((other) => other.setAttribute('aria-pressed', String(other === chip)));
          draw();
        });
        chips.appendChild(chip);
      });
      draw();
    }

    function renderTooling() {
      const target = byId('tooling-groups');
      if (!target) return;
      target.replaceChildren();
      const order = ['still-required', 'optional-compatibility', 'deprecated', 'removable'];
      const labels = {
        'still-required': 'Still required',
        'optional-compatibility': 'Optional compatibility',
        deprecated: 'Deprecated',
        removable: 'Removable'
      };
      const groups = new Map(order.map((lifecycle) => [lifecycle, []]));
      data.tooling_audit.forEach((entry) => {
        if (!groups.has(entry.lifecycle)) groups.set(entry.lifecycle, []);
        groups.get(entry.lifecycle).push(entry);
      });
      order.forEach((lifecycle) => {
        const entries = groups.get(lifecycle);
        if (!entries || !entries.length) return;
        const group = createElement('section', 'tooling-group');
        const heading = createElement('div', 'tooling-group-title');
        heading.appendChild(createElement('span', '', labels[lifecycle] || lifecycle));
        heading.appendChild(createElement('span', 'lifecycle-label', `${entries.length} surfaces`));
        heading.lastChild.dataset.lifecycle = lifecycle;
        group.appendChild(heading);
        const list = createElement('div', 'tooling-items');
        entries.forEach((entry) => {
          const surface = createElement('details', 'tooling-surface');
          surface.appendChild(createElement('summary', '', entry.label));
          surface.appendChild(createElement('p', '', entry.purpose));
          const recommendation = createElement('p');
          recommendation.appendChild(createElement('strong', '', 'Recommendation: '));
          recommendation.appendChild(documentRef.createTextNode(entry.recommendation));
          surface.appendChild(recommendation);
          list.appendChild(surface);
        });
        group.appendChild(list);
        target.appendChild(group);
      });
      setText('tooling-count', `${data.tooling_audit.length} cataloged surfaces`);
    }

    function renderDetail(skill) {
      const detail = byId('skill-detail');
      applyCategory(detail, skill.category);
      detail.replaceChildren();
      const header = createElement('div', 'detail-header');
      const titleBlock = createElement('div');
      titleBlock.appendChild(createElement('p', 'eyebrow', skill.category));
      const detailTitle = createElement('h2', '', skill.display_name);
      detailTitle.id = 'detail-title';
      titleBlock.appendChild(detailTitle);
      titleBlock.appendChild(createElement('p', 'skill-id', skill.id));
      header.appendChild(titleBlock);
      if (skill.documentation_completeness.status === 'specialized') header.appendChild(createElement('span', 'specialized-badge', 'Specialized compatibility skill'));
      detail.appendChild(header);
      detail.appendChild(createElement('p', 'detail-description', skill.description));
      if (skill.documentation_completeness.status === 'specialized') detail.appendChild(createElement('p', 'detail-specialized', skill.documentation_completeness.notes));

      const grid = createElement('div', 'detail-grid');
      const purpose = createElement('section', 'detail-block detail-wide');
      purpose.appendChild(createElement('h3', '', 'Primary purpose'));
      purpose.appendChild(createElement('p', '', skill.primary_purpose));
      grid.appendChild(purpose);
      const use = createElement('section', 'detail-block');
      use.appendChild(createElement('h3', '', 'Use when'));
      addList(use, skill.use_when);
      grid.appendChild(use);
      const avoid = createElement('section', 'detail-block');
      avoid.appendChild(createElement('h3', '', 'Avoid when'));
      addList(avoid, skill.avoid_when);
      grid.appendChild(avoid);
      const context = createElement('section', 'detail-block detail-wide');
      context.appendChild(createElement('h3', '', 'Preferred context'));
      context.appendChild(createElement('p', '', skill.preferred_context));
      grid.appendChild(context);
      if (skill.recommended_changes.length) {
        const notes = createElement('section', 'detail-block detail-wide');
        notes.appendChild(createElement('h3', '', 'Catalog note'));
        addList(notes, skill.recommended_changes);
        grid.appendChild(notes);
      }
      const outputs = createElement('section', 'detail-block');
      outputs.appendChild(createElement('h3', '', 'Expected outputs'));
      addList(outputs, skill.expected_outputs);
      grid.appendChild(outputs);
      const tags = createElement('section', 'detail-block');
      tags.appendChild(createElement('h3', '', 'Intent tags'));
      const tagList = createElement('div', 'detail-tags');
      skill.tags.forEach((tag) => tagList.appendChild(createElement('span', 'tag', tag)));
      tags.appendChild(tagList);
      grid.appendChild(tags);
      const prompts = createElement('section', 'detail-block detail-wide');
      prompts.appendChild(createElement('h3', '', 'Example prompts'));
      const promptList = createElement('div', 'prompt-list');
      skill.example_prompts.forEach((prompt) => {
        const item = createElement('div', 'prompt-item');
        item.appendChild(createElement('span', '', prompt));
        const copy = createElement('button', 'copy-button', 'Copy');
        copy.type = 'button';
        copy.dataset.copyText = prompt;
        item.appendChild(copy);
        promptList.appendChild(item);
      });
      prompts.appendChild(promptList);
      grid.appendChild(prompts);
      const related = createElement('section', 'detail-block');
      related.appendChild(createElement('h3', '', 'Related skills'));
      const relatedList = createElement('div', 'detail-related');
      skill.related_skills.forEach((relatedId) => {
        relatedList.appendChild(skillChip(relatedId));
      });
      related.appendChild(relatedList);
      grid.appendChild(related);
      const cases = (data.use_cases || []).filter((useCase) => useCase.skills.includes(skill.id));
      if (cases.length) {
        const caseBlock = createElement('section', 'detail-block');
        caseBlock.appendChild(createElement('h3', '', 'Use cases'));
        const caseList = createElement('ul', 'detail-use-cases');
        cases.forEach((useCase) => {
          const item = createElement('li');
          const link = createElement('a', '', useCase.title);
          link.href = useCase.source_url;
          link.target = '_blank';
          link.rel = 'noopener';
          item.appendChild(link);
          caseList.appendChild(item);
        });
        caseBlock.appendChild(caseList);
        grid.appendChild(caseBlock);
      }
      const memberships = createElement('section', 'detail-block');
      memberships.appendChild(createElement('h3', '', 'Workflow membership'));
      const workflowList = createElement('div', 'detail-workflows');
      skill.workflow_membership.forEach((workflowId) => {
        const workflow = workflowById.get(workflowId);
        const button = createElement('button', '', workflow ? workflow.name : workflowId);
        button.type = 'button';
        button.dataset.openWorkflow = workflowId;
        workflowList.appendChild(button);
      });
      if (!skill.workflow_membership.length) workflowList.appendChild(createElement('p', '', 'No primary workflow membership; use search or related skills to explore.'));
      memberships.appendChild(workflowList);
      grid.appendChild(memberships);
      const hosts = createElement('section', 'detail-block detail-wide');
      hosts.appendChild(createElement('h3', '', 'Invoke on your host'));
      const hostList = createElement('div', 'detail-hosts');
      data.hosts.forEach((host) => {
        const hostButton = createElement('button', 'detail-host');
        hostButton.type = 'button';
        hostButton.dataset.copyText = invocationFor(host, skill.id);
        hostButton.appendChild(createElement('strong', '', host.name));
        hostButton.appendChild(createElement('code', '', invocationFor(host, skill.id)));
        const copyStatus = createElement('span', 'copy-status');
        copyStatus.setAttribute('role', 'status');
        copyStatus.setAttribute('aria-live', 'polite');
        copyStatus.setAttribute('aria-atomic', 'true');
        hostButton.appendChild(copyStatus);
        hostList.appendChild(hostButton);
      });
      hosts.appendChild(hostList);
      grid.appendChild(hosts);
      detail.appendChild(grid);
      const source = createElement('div', 'detail-source');
      source.appendChild(createElement('span', '', `Canonical source: ${skill.source_path}`));
      const link = createElement('a', '', 'Open repository source ↗');
      link.href = skill.source_url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      source.appendChild(link);
      detail.appendChild(source);
    }

    function showDialog() {
      documentRef.body.classList.add('dialog-open');
      if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
      else dialog.setAttribute('open', '');
      byId('detail-close').focus();
    }

    // The address to show when no skill dialog is open.
    function restingUrl() {
      if (page === 'workflows' && state.workflow) return serializeHash('workflow', state.workflow);
      return `${window.location.pathname}${window.location.search}`;
    }

    function closeDialog(updateUrl) {
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      documentRef.body.classList.remove('dialog-open');
      const returnFocus = dialogReturnFocus;
      dialogReturnFocus = null;
      if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
      if (updateUrl && window.location.hash.startsWith('#skill/')) window.history.pushState(null, '', restingUrl());
    }

    function openSkill(id, updateUrl) {
      const skill = skillById.get(id);
      if (!skill) return;
      if (!dialog.open) dialogReturnFocus = documentRef.activeElement;
      renderDetail(skill);
      byId('detail-kicker').textContent = `${skill.category} · Skill details`;
      showDialog();
      if (updateUrl !== false && window.location.hash !== serializeHash('skill', id)) window.history.pushState(null, '', serializeHash('skill', id));
    }

    function showWorkflow(id, moveFocus) {
      state.workflow = workflowById.has(id) ? id : null;
      renderWorkflowView();
      if (!state.workflow) return;
      const heading = byId(`workflow-title-${state.workflow}`);
      byId('workflow-detail').scrollIntoView({ block: 'start' });
      if (moveFocus && heading) heading.focus({ preventScroll: true });
    }

    function openWorkflow(id, updateUrl) {
      if (!workflowById.has(id)) return;
      if (page !== 'workflows') {
        window.location.href = `workflows.html${serializeHash('workflow', id)}`;
        return;
      }
      closeDialog(false);
      showWorkflow(id, true);
      if (updateUrl !== false && window.location.hash !== serializeHash('workflow', id)) window.history.pushState(null, '', serializeHash('workflow', id));
    }

    function applyHash() {
      const locationHash = parseHash(window.location.hash);
      if (page === 'index') {
        // Send links to the earlier one-page portal to the page that now holds the section.
        if (locationHash.type === 'workflow' && workflowById.has(locationHash.id)) {
          window.location.replace(`workflows.html${serializeHash('workflow', locationHash.id)}`);
          return;
        }
        if (movedSections[locationHash.type]) {
          window.location.replace(movedSections[locationHash.type]);
          return;
        }
      }
      if (locationHash.type === 'skill' && skillById.has(locationHash.id)) {
        openSkill(locationHash.id, false);
        return;
      }
      closeDialog(false);
      if (page !== 'workflows') return;
      if (locationHash.type === 'workflow' && workflowById.has(locationHash.id)) showWorkflow(locationHash.id, true);
      else if (locationHash.type === 'start') showWorkflow(null, false);
    }

    function updateFilter(group, value) {
      if (group === 'category') state.category = value;
      if (group === 'tag') state.tags = state.tags.includes(value) ? state.tags.filter((tag) => tag !== value) : [...state.tags, value];
      state.expandedCategory = null;
      renderFilters();
      renderSkills();
      renderCategoryBuckets();
      renderCategoryBucketPanel();
      const filterContainer = byId(group === 'category' ? 'category-filters' : 'tag-filters');
      const selected = Array.from(filterContainer.children).find((button) => button.dataset.filterValue === value);
      if (selected) selected.focus({ preventScroll: true });
    }

    function toggleCategoryBucket(category) {
      state.expandedCategory = categoryBucketState(state.expandedCategory, category, data.categories);
      state.category = state.expandedCategory || 'all';
      renderCategoryBuckets();
      renderCategoryBucketPanel();
      renderFilters();
      renderSkills();
      const selected = Array.from(byId('category-buckets').children).find((button) => button.dataset.categoryBucket === category);
      if (selected) selected.focus({ preventScroll: true });
    }

    function fallbackCopy(text) {
      const input = documentRef.createElement('textarea');
      input.value = text;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      documentRef.body.appendChild(input);
      input.select();
      let copied = false;
      try {
        copied = typeof documentRef.execCommand === 'function' && documentRef.execCommand('copy');
      } catch (_) {
        copied = false;
      }
      input.remove();
      return Boolean(copied);
    }

    function copyText(button, text) {
      const original = button.textContent;
      const status = button.querySelector('.copy-status');
      const done = (copied) => {
        const message = copied ? 'Copied' : 'Copy failed';
        if (status) {
          status.textContent = message;
          window.setTimeout(() => { status.textContent = ''; }, 1200);
        } else {
          button.textContent = message;
          window.setTimeout(() => { button.textContent = original; }, 1200);
        }
      };
      const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : null;
      if (clipboard && typeof clipboard.writeText === 'function') {
        clipboard.writeText(text).then(() => done(true), () => done(fallbackCopy(text)));
      } else done(fallbackCopy(text));
    }

    function applyTheme(theme) {
      const resolved = themeState(theme, false);
      documentRef.documentElement.dataset.theme = resolved.theme;
      const toggle = byId('theme-toggle');
      toggle.textContent = resolved.buttonText;
      toggle.setAttribute('aria-label', resolved.ariaLabel);
      toggle.setAttribute('aria-pressed', String(resolved.isDark));
    }

    function resetFinder() {
      Object.assign(state, clearFilters());
      state.expandedCategory = null;
      byId('skill-search').value = '';
      renderFilters();
      renderSkills();
      renderCategoryBuckets();
      renderCategoryBucketPanel();
    }

    const hasFinder = Boolean(byId('skills-grid'));
    if (hasFinder) {
      on('skill-search', 'input', (event) => {
        state.query = event.target.value;
        renderSkills();
        renderCategoryBucketPanel();
      });
      on('clear-search', 'click', () => {
        state.query = '';
        byId('skill-search').value = '';
        renderSkills();
        renderCategoryBucketPanel();
        byId('skill-search').focus();
      });
      on('clear-filters', 'click', resetFinder);
      on('empty-clear', 'click', resetFinder);
      on('category-buckets', 'click', (event) => {
        const button = event.target.closest('[data-category-bucket]');
        if (button) toggleCategoryBucket(button.dataset.categoryBucket);
      });
      on('category-filters', 'click', (event) => {
        const button = event.target.closest('[data-filter-group="category"]');
        if (button) updateFilter('category', button.dataset.filterValue);
      });
      on('tag-filters', 'click', (event) => {
        const button = event.target.closest('[data-filter-group="tag"]');
        if (button) updateFilter('tag', button.dataset.filterValue);
      });
    }
    on('workflow-back', 'click', (event) => {
      event.preventDefault();
      showWorkflow(null, false);
      window.history.pushState(null, '', restingUrl());
      byId('main-content').scrollIntoView({ block: 'start' });
    });
    documentRef.addEventListener('click', (event) => {
      const skillButton = event.target.closest('[data-open-skill]');
      if (skillButton) openSkill(skillButton.dataset.openSkill);
      const workflowButton = event.target.closest('[data-open-workflow]');
      if (workflowButton) openWorkflow(workflowButton.dataset.openWorkflow);
      const copyButton = event.target.closest('[data-copy-text]');
      if (copyButton && !skillButton) copyText(copyButton, copyButton.dataset.copyText);
    });
    documentRef.addEventListener('keydown', (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k' || dialog.open || !hasFinder) return;
      event.preventDefault();
      byId('skill-search').focus();
    });
    byId('detail-close').addEventListener('click', () => closeDialog(true));
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog(true);
    });
    byId('theme-toggle').addEventListener('click', () => {
      const isDark = documentRef.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      try { window.localStorage.setItem('agent-toolbelt-theme', nextTheme); } catch (_) { /* Storage is optional for file://. */ }
    });
    let savedTheme = null;
    try {
      savedTheme = window.localStorage.getItem('agent-toolbelt-theme');
    } catch (_) { /* Storage is optional for file://. */ }
    const prefersDark = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(themeState(savedTheme, prefersDark).theme);
    window.addEventListener('hashchange', applyHash);
    window.addEventListener('popstate', applyHash);
    renderHosts();
    renderTaskShortcuts();
    renderHeroInstall();
    renderHostSetup();
    renderStartHere();
    if (hasFinder) {
      renderCategoryBuckets();
      renderFilters();
      renderSkills();
      renderCategoryBucketPanel();
    }
    renderWorkflowView();
    renderUseCases();
    renderTooling();
    applyHash();
    return { state, openSkill, openWorkflow, renderSkills };
  }

  return { categoryBucketState, categorySkillIds, clearFilters, filterSkills, invocationFor, init, normalizeText, parseHash, serializeHash, skillSearchText, themeState };
}));
