import { DirectoryTreeNode } from "./treeNode.js";

const fileTree = document.getElementById('fileTree');
let rootNode;


fetch('http://localhost:3001/api/path/')
    .then(res=>res.json())
    .then(data=> {
        //function call
        //console.log(data);
      let overlay = document.querySelector('.overlay');
      overlay.classList.add('overlay--hidden');
      rootNode = new DirectoryTreeNode('root', 'directory', Date.now());
      for (let item of data) {
          let childNode = new DirectoryTreeNode(item.name, item.type, item.lastModifiedTime);
          rootNode.addChild(childNode);
      }

      updateVisualTree(fileTree, rootNode);
    });

fileTree.addEventListener('click', event=>{
    let classes = event.target.classList;
    let target = event.target;

    let treeEntry = target.parentElement;
    let directoryName = treeEntry.dataset.pathName.slice(6);
    let pathArr = ('root/' + directoryName).split('/');
    let parentNode = (findNode(pathArr, rootNode));

    if (classes.contains('tree-entry__disclosure') && !classes.contains('tree-entry__disclosure--disabled')) {
        classes.toggle('tree-entry__disclosure--closed');
        classes.toggle('tree-entry__disclosure--opened')
        console.log("parentNode: ", parentNode);

        const targetUL = treeEntry.querySelector('ul');
        if(classes.contains('tree-entry__disclosure--opened')){
            treeEntry.querySelector('img').setAttribute('src', `/icons/folder_type_${parentNode.getIconTypeName()}_opened.svg`)
            if (targetUL) targetUL.style.display = 'block';
            else {
                fetch(`http://localhost:3001/api/path/${directoryName}`)
                .then(res=>res.json())
                .then(data=>{

                    for(let item of data){
                        let childNode = new DirectoryTreeNode(item.name, item.type, item.lastModifiedTime);
                        parentNode.addChild(childNode);
                    }
                    console.log(data)
                    updateVisualTree(treeEntry, parentNode);
                })
            }

        }
        else {
            //delete
            treeEntry.querySelector('img').setAttribute('src', `/icons/folder_type_${parentNode.getIconTypeName()}.svg`)
            targetUL.style.display = 'none';
            // parentNode.children = [];
            // treeEntry.querySelector('ul').remove()
        }
    }
    if (classes.contains('tree-entry__name') && (parentNode.type === 'file')) {
        fetch(`http://localhost:3001/api/file/${directoryName}`)
        .then(res=>res.text())
        .then(data=>{
            document.getElementById('fileSystem__content').innerHTML = data;
        });
    }
})

function findNode(pathArr, node) {
    if (pathArr.length === 1){
        return node;
    }
    else{
        for(let child of node.children){
            if(child.name === pathArr[1]){
                pathArr.shift();
                return findNode(pathArr, child);
            }
        }
    }
}

function updateVisualTree(element, directoryTreeNode) {
    const ul = document.createElement('ul');
    ul.classList.add('tree');
    for (let child of directoryTreeNode.children) {
        updateVisualTreeEntry(ul, child);
    }
    element.appendChild(ul);
}

    function updateVisualTreeEntry(treeElement, child) {
    const li = document.createElement('li');
        li.dataset.pathName = `${child.getFullPath()}`
        li.classList.add('tree-entry');
        if (child.type === 'file') {
            li.innerHTML = `
            <div class="tree-entry__disclosure tree-entry__disclosure--disabled"></div>
            <img class="tree-entry__icon" src="/icons/file_type_${child.getIconTypeName()}.svg">
            <div class="tree-entry__name">${child.name}</div>
            <div class="tree-entry__time">${child.lastModifiedTime}</div>
            `;
        } else if (child.type === 'directory') {
            li.innerHTML = `
            <div class="tree-entry__disclosure tree-entry__disclosure--closed"></div>
            <img class="tree-entry__icon" src="/icons/folder_type_${child.getIconTypeName()}.svg">
            <div class="tree-entry__name">${child.name}</div>
            <div class="tree-entry__time">${child.lastModifiedTime}</div>
            `;
        }
        treeElement.appendChild(li);
    }

// let rootNode = new DirectoryTreeNode
