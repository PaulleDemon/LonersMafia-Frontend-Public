import { Link } from "react-router-dom"
import ENDPOINTS from "../constants/url-endpoints"


const linkifyConfig = [
        {
            regex: /\b(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\w+/,
            fn: (key, result) => {
                // match mail id
                // console.log("Mail: ", result)
                return (<span key={key}>
                  <a
                    target="_blank"
                    className="linkify-link-color"
                    onClick={(e) => e.stopPropagation()}
                    href={`mailto:${result[0]}`}
                  >
                    {result[0]}
                  </a>
                  {result[4]}
                </span>
                )
            }
        },
        ,
        {
            regex: /\bS\/\w+/gm, //regex to match a Spaces
            fn: (key, result) => {
                // console.log("space: ", result)
                return (<Link key={key} 
                            to={ENDPOINTS.spaceviewposts(result[0].slice(2, ))}
                            onClick={(e) => e.stopPropagation()}
                            className="linkify-link-color"
                            >
                            {result[0]}
                        </Link>)
            } 
        },
        {
            regex: /(^|\s)(#[a-z\d-]+)/ig, // match hashtag
            fn: (key, result) => {
                // console.log("result: ", result)
                return (<Link key={key} 
                    to={ENDPOINTS.searchview(result[0].slice(1, ))}
                    onClick={(e) => e.stopPropagation()}
                    className="linkify-link-color"
                    >
                    {result[0]}
                </Link>)
            }
        },
        {
            regex: /\bl\/\w+/gm, //regex to match a username /\B@[a-z0-9_-]+/gi
            fn: (key, result) => {
                // console.log("usernme: ", result[0].slice(1))
                return (<Link key={key} 
                            to={ENDPOINTS.profileviewposts(result[0].slice(1, ))}
                            onClick={(e) => e.stopPropagation()}
                            className="linkify-link-color"
                            >
                            {result[0]}
                        </Link>)
            }
        },
        {   
            
            regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
            fn: (key, result) => {
                // match links
                const url = new URL(result[0])
                // console.log("result: ", result, url.host, url)
                
                return (
                    <span key={key}>
                        <a
                            target="_blank"
                            href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}
                            onClick={(e) => e.stopPropagation()}
                            className="linkify-link-color"
                        >
                        {result[0].slice(0, 80)}{result[0].length>80?"...":""}
                        </a>
                        {result[5]}
                    </span>
                    )
                

            }
          },
]


function processString(options) {
    let key = 0;

    function processInputWithRegex(option, input) {
        if (!option.fn || typeof option.fn !== 'function')
            return input;

        if (!option.regex || !(option.regex instanceof RegExp))
            return input;

        if (typeof input === 'string') {
            let regex = option.regex;
            let result = null;
            let output = [];

            while ((result = regex.exec(input)) !== null) {
                let index = result.index;
                let match = result[0];

                output.push(input.substring(0, index));
                output.push(option.fn(++key, result));

                input = input.substring(index + match.length, input.length + 1);
                regex.lastIndex = 0;
            }

            output.push(input);
            return output;
        } else if (Array.isArray(input)) {
            return input.map(chunk => processInputWithRegex(option, chunk));
        } else return input;
    }

    return function (input) {
        if (!options || !Array.isArray(options) || !options.length)
            return input;

        options.forEach(option => input = processInputWithRegex(option, input));

        return input;
    };
}


export function linkify(text){
   return (processString(linkifyConfig)(text))
}