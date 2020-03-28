export class DirectoryTreeNode {
    constructor(name, type, lastModifiedTime) {
      this.name = name;
      this.type = type;
      this.lastModifiedTime = lastModifiedTime;
      this.children = [];
    }
  
  
    // getIconTypeName returns a 'name' based on the type of file so
    // we can look into the images directory and load the correct image
    // file to display next to our files.
  
    // Note: This can be smarter. Look at the icons available
    // and perhaps make this better. For example, this
    // will return "png" for PNG files. There is no
    // icon for PNG. However, there is an icon for "image".
    // Those kinds of mappings will improve your UI.
    getIconTypeName() {
      if (this.type === 'directory') {
        return this.name;
      }
  
      // If it's a file, we parse out the `extension`
      // and use that as our file type
      // Extensions are the bit after the file name such as
      // .jpg .png .txt .js .css
      if (this.type === 'file') {
        const dotIndex = this.name.lastIndexOf('.');
        if (dotIndex >= 0) {
          return this.name.substring(dotIndex + 1).toLowerCase();
        }
        return this.name;
      }
  
      return '';
    }

  
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    getFullPath() {
        // Special case for the root node with no name
        if (this.name === undefined) {
            return '';
        }

        let parentPath = '';
        if (this.parent !== undefined) {
            parentPath = this.parent.getFullPath();
        }
        return `${parentPath}/${this.name}`;
    }

  }

