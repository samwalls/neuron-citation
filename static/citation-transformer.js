
fetch('./cache.json')
    .then(response => {
        //console.log('found cache.json');
        response.json().then(json => {
            const head = document.head;
            const metaElements = head.getElementsByTagName('meta');
            let pageId = undefined;
            for (const el of metaElements) {
                if (el.getAttribute('property') === 'neuron:zettel-id') {
                    pageId = el.getAttribute('content');
                }
            }
            if (pageId === undefined) {
                console.error('could not find neuron:zettel-id metadata in <head>');
                return;
            }

            // const url = window.location.href;
            // const lastSegment = url.substring(url.lastIndexOf('/') + 1);
            // const pageNode = lastSegment.substring(0, lastSegment.lastIndexOf('.'));

            const Cite = window.require('citation-js');
            let references = {};
            for (const node in json.Graph.vertices) {
                const data = json.Graph.vertices[node];
                const reference = data.Meta.reference;
                if (reference !== undefined) {
                    console.log(`found reference data for ${node}:`);
                    //console.log(`adding reference: ${JSON.stringify(reference)}`);
                    const results = Cite.parse.input.chain(reference);
                    for (const result of results) {
                        references[result.id] = result;
                    }
                }
            }

            // transform parts of the page using <cite> elements
            const citations = document.body.querySelectorAll('cite');
            for (const citation of citations) {
                //console.log(citation);
                const zettelLinks = citation.querySelectorAll('.zettel-link');
                for (const zettelLink of zettelLinks) {
                    const cite = new Cite();
                    console.log(references);

                    // two options, either the <cite> contains a ref attribute, or it doesn't, and we use the reference of each zettel link in the citation
                    const label = citation.getAttribute('label');
                    if (label !== undefined && label !== null) {
                        const style = citation.getAttribute('style');
                        if (style === undefined || style === null) {
                            // TODO: output a code block containing bibtex here
                            // TODO: add a "copy text" widget to the box
                        }
                        // get first anchor
                        // TODO: figure out support for multiple elements inside the <cite>
                        const anchor = zettelLink.querySelector('a');
                        
                        const type = citation.getAttribute('type');
                        if (type === 'title') {
                            anchor.innerHTML = references[label].title;
                        } else if (type === 'titleyear') {
                            anchor.innerHTML = `${references[label].title} (${references[label].issued['date-parts'][0][0]})`;
                        } else {
                            cite.add(references[label]);
                            const content = cite.get({format: 'string', type: 'string', style: 'citation-apa', lang: 'en'});
                            anchor.innerHTML = content;
                        }
                    } else {
                        // TODO
                    }
                }
            }
        })
        .catch(json => console.log(`encountered error when working with the cache data: ${json}`));
    })
    .catch(json => console.log(`encountered error when fetching cache.json: ${json}`));