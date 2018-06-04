var assert = require('assert');
var RDF2h = require('rdf2h');
var rdf = require('ext-rdflib');
var read = require('read-file');

describe('RDF2h', function () {
  describe('#fallback-renderers', function () {
    it('Single statement', function (done) {
      var dataTurtle = '@prefix dc: <http://dublincore.org/2012/06/14/dcelements#>. \n\
                <http://example.org/> dc:title "An example".';
      var matchersTurtle = read.sync("fallback-renderers.ttl", "utf-8");
      RDF2h.prefixMap['dc'] = "http://dublincore.org/2012/06/14/dcelements#";
      var matchers = rdf.graph();
      rdf.parse(matchersTurtle, matchers, "http://example.org/matchers/", "text/turtle", () => {
        var data = rdf.graph();
        rdf.parse(dataTurtle, data, "http://example.org/data", "text/turtle", () => {
          var renderingResult = new RDF2h(matchers).render(data, "http://example.org/");
          console.log("result: " + renderingResult);
          assert.equal(`
          <strong>Resource: <a href="http://example.org/">http://example.org/</a></strong>
      <div id="http://example.org/"><table width="100%"><tr><td width="40%"><a href="http://dublincore.org/2012/06/14/dcelements#title" title="http://dublincore.org/2012/06/14/dcelements#title" style="color:#000000;text-decoration:none">http://dublincore.org/2012/06/14/dcelements#title</a></td><td width="60%">An example</td></table><hr></div>`, renderingResult);
          done();
        });
      });

    });
  });
});

