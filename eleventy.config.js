module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");

  eleventyConfig.addFilter("date", function(date, format) {
    const d = new Date(date);
    if (format === "iso") return d.toISOString().split("T")[0];
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};
