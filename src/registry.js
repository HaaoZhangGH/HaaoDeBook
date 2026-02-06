(function () {
  const DesignBook = (window.DesignBook = window.DesignBook || {});

  DesignBook.modules = DesignBook.modules || {};
  DesignBook.registerModule = function registerModule(key, mod) {
    DesignBook.modules[key] = mod;
  };
  DesignBook.getModule = function getModule(key) {
    return DesignBook.modules[key] || null;
  };

  DesignBook.projects = [
    {
      id: "color-models",
      title: "颜色",
      topics: [
        {
          id: "ui-color-system",
          title: "UI 设计系统",
          icon: "ui-system",
          key: "color-models/ui-color-system",
          entry: "./src/projects/color-models/topics/ui-color-system/topic.js",
          hidePanel: true,
        },
        {
          id: "levels-tones",
          title: "色阶&影调",
          icon: "levels-tones",
          key: "color-models/levels-tones",
          entry: "./src/projects/color-models/topics/levels-tones/topic.js",
        },
        {
          id: "rgb-cube",
          title: "RGB 颜色模型",
          icon: "rgb-cube",
          key: "color-models/rgb-cube",
          entry: "./src/projects/color-models/topics/rgb-cube/topic.js",
          needsThree: true,
        },
      ],
    },
  ];

  DesignBook.validateRegistry = function validateRegistry() {
    const seenProjectIds = new Set();
    const seenTopicKeys = new Set();

    for (const project of DesignBook.projects || []) {
      if (!project?.id) {
        console.warn("[DesignBook] Invalid project: missing id", project);
        continue;
      }
      if (seenProjectIds.has(project.id)) {
        console.warn(`[DesignBook] Duplicate project id: ${project.id}`);
      }
      seenProjectIds.add(project.id);

      const seenTopicIds = new Set();
      for (const topic of project.topics || []) {
        if (!topic?.id) {
          console.warn(`[DesignBook] Invalid topic: missing id in project ${project.id}`, topic);
          continue;
        }
        if (seenTopicIds.has(topic.id)) {
          console.warn(`[DesignBook] Duplicate topic id: ${project.id}/${topic.id}`);
        }
        seenTopicIds.add(topic.id);

        const expectedKey = `${project.id}/${topic.id}`;
        if (topic.key !== expectedKey) {
          console.warn(`[DesignBook] Topic key mismatch: expected ${expectedKey}, got ${topic.key}`);
        }
        if (topic.key && seenTopicKeys.has(topic.key)) {
          console.warn(`[DesignBook] Duplicate topic key: ${topic.key}`);
        }
        if (topic.key) seenTopicKeys.add(topic.key);

        const expectedEntrySuffix = `/src/projects/${project.id}/topics/${topic.id}/topic.js`;
        if (typeof topic.entry !== "string" || !topic.entry.includes(expectedEntrySuffix)) {
          console.warn(`[DesignBook] Topic entry path unexpected: ${topic.entry} (expected to include ${expectedEntrySuffix})`);
        }

        if (topic.needsThree !== undefined && typeof topic.needsThree !== "boolean") {
          console.warn(`[DesignBook] Topic needsThree should be boolean: ${topic.key}`);
        }
      }
    }
  };

  DesignBook.getProject = function getProject(projectId) {
    return DesignBook.projects.find((p) => p.id === projectId) || null;
  };

  DesignBook.getTopic = function getTopic(project, topicId) {
    return (project?.topics || []).find((t) => t.id === topicId) || null;
  };

  DesignBook.validateRegistry();
})();
