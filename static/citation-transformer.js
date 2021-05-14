
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
                    const results = Cite.parse.input.chain(reference);
                    for (const result of results) {
                        // TODO: this is a horrible way to build references, we need a way of mapping from each variation of the same ID (e.g. DOI, DOI URL, ...) to the same object
                        if (result.id !== undefined) {
                            references[result.id] = result;
                        }

                        for (const equivalent of result._graph) {
                            console.log(equivalent);
                            if (equivalent.data !== undefined) {
                                references[equivalent.data] = result;
                                console.log(`${equivalent.data} -> ${result}`);
                            }
                        }
                    }
                }
            }

            //console.log(references);

            // transform parts of the page using <cite> elements
            const citations = document.body.querySelectorAll('cite');
            for (const citation of citations) {
                //console.log(citation);
                const zettelLinks = citation.querySelectorAll('.zettel-link');
                for (const zettelLink of zettelLinks) {
                    const cite = new Cite();

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