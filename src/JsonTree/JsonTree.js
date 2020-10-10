import React, { useEffect, useState } from 'react';
import './JsonTree.scss';

function JsonTree({url}) {

  const [json, setJson] = useState({});

  /*
  Note that I would normally place the API call outside of the ui component, and give it the retrieved json as a property instead.
  However, the test specifically stated that the ui component needs to do the json retrieval itself.
  */
  useEffect(() => {
    if (url.substring(0,4) === 'http') {
      fetch(url).then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        res.json().then(data => {
          setJson(data);
        });
      }).catch(function(error) {
        console.log(error);
      });
    } else {
      setJson({});
    }
  }, [url]);

  /*A not about the implementation of collapsible tree:
    A more "proper" React way of implementing this would be by saving a state of collapsed nodes and updating the ui according to that.
    However, in very large JSONs that would be very inefficient due to always re-rendering the entire tree with every collapse or expand action.
    Since nothing actually changes data-wise when collapsing or expanding the tree, I thought it would be fine to do it via direct DOM manipulation.
  */
  const toggleCollapse = (e, key) => {
    e.currentTarget.classList.toggle('collapsed');

    if (e.currentTarget.classList.contains('collapsed')) {
      document.querySelectorAll(`.treeElement[data-key|="${key}"]`).forEach(element => {
        element.classList.add('hide');
      });
      e.currentTarget.classList.remove('hide');
    } else {
      function showElements(id, level) {
        document.querySelectorAll(`.treeElement[data-key|="${id}"][data-level="${level}"]`).forEach(element => {
          element.classList.remove('hide');
          if (element.classList.contains('clickable') && !element.classList.contains('collapsed')) {
            showElements(element.dataset.key, level + 1);
          }
        });
      }

      showElements(key, parseInt(e.currentTarget.dataset.level) + 1);
    }
  }

  const isImageUrl = str => {
    let strEnd = str.substring(str.length - 4, str.length)
    return (str.substring(0,4) === 'http' && (strEnd === '.png' || strEnd === '.jpg' || strEnd === '.svg'));
  }

  const renderJsonTree = (obj, parentKeys = [], level = 0) => {
    let tree = [];
    Object.entries(obj).forEach(([key, value]) => {
      //reactKey is also used when toggling collapse, see toggleCollapse function
      let reactKey = parentKeys.length === 0 ? key : `${parentKeys.join('-')}-${key}`;
      if (typeof value === 'object') {
        //recursively call renderJsonTree
        let parentKeysClone = [...parentKeys];
        parentKeysClone.push(key);
        tree.push(<div className="treeElement clickable" onClick={e => {toggleCollapse(e, reactKey)}} style={{marginLeft: `${25 * level}px`}} data-level={level} data-key={reactKey} key={reactKey}>
                    <div className="arrow"></div>
                    {key}
                  </div>);
        tree.push(...renderJsonTree(value, parentKeysClone , level + 1));
      } else {
        //display image if value is image url, otherwise just display the value
        if (isImageUrl(value.toString())) {
          tree.push(<div className="treeElement" style={{marginLeft: `${25 * level}px`}} data-level={level} data-key={reactKey} key={reactKey}>{`${key}:`}<img src={value} alt=''/></div>);
        } else {
          tree.push(<div className="treeElement" style={{marginLeft: `${25 * level}px`}} data-level={level} data-key={reactKey} key={reactKey}>{`${key}: ${value}`}</div>);
        }        
      }
      
    });

    return tree;
  }

  return (
    <div className="jsonTree">
      {renderJsonTree(json)}
    </div>
  );
}

export default JsonTree;
