const plugin = 'directory-resolve-plugin';

//// pipeline ////
// The list of event names.

// resolve
// internal-resolve
// new-interal-resolve
// parsed-resolve
// described-resolve
// internal
// raw-module
// module
// resolve-as-module
// undescribed-resolve-in-package
// resolve-in-package
// resolve-in-existing-directory
// relative
// described-relative
// directory
// undescribed-existing-directory
// existing-directory
// undescribed-raw-file
// raw-file
// file
// final-file
// existing-file
// resolved

// The source is start pipeline: use the prefix `before` or `after` with pipeline, e.g. `before-resolve`.
// The Target is one of pipeline list.

class DirectoryResolvePlugin {
  /**
   *
   * @param {string} source The source is the name of the event that starts the pipeline.
   *   Use the prefix `before` or `after` with event name, e.g. `before-resolve`.
   * @param {string} target The target is the event name what should fire.
   */
  constructor(source, target) {
    this.source = source;
    this.target = target;
  }

  apply(resolver) {
    const target = resolver.ensureHook(this.target);
    //console.log('\n** [directory-resolve-plugin] target: ', target);

    resolver.getHook(this.source).tapAsync(plugin, (request, resolveContext, callback) => {
      let message = null;
      //console.log('\n** [directory-resolve-plugin] request: ', request, resolveContext);
      //console.log('\n** [directory-resolve-plugin]\n: ', resolveContext.stack);

      // Any logic you need to create a new `request` can go here
      resolver.doResolve(target, request, message, resolveContext, callback);
    });
  }
}

module.exports = DirectoryResolvePlugin;
