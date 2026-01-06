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
      title: "颜色模型",
      topics: [
        {
          id: "rgb-cube",
          title: "RGB 颜色模型",
          key: "color-models/rgb-cube",
          entry: "./src/projects/color-models/topics/rgb-cube/topic.js",
        },
      ],
    },
  ];

  DesignBook.getProject = function getProject(projectId) {
    return DesignBook.projects.find((p) => p.id === projectId) || null;
  };

  DesignBook.getTopic = function getTopic(project, topicId) {
    return (project?.topics || []).find((t) => t.id === topicId) || null;
  };
})();

