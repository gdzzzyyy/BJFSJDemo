const e = {};

const FindChild = (node, name)=>
{
    if (node.name == name)
    {
        return node;
    }

    for(let i=0; i<node.children.length; ++i)
    {
        let c = FindChild(node.children[i], name);
        if (c != null)
        {
            return c;
        }
    }
}

const GetVzbScope = (node) =>
{
    if (node._spd != null)
    {
        return node._spd;
    }
    else if (node.parent != null)
    {
        return GetVzbScope(node.parent);
    }
}

e.FindChild = FindChild;
e.GetVzbScope = GetVzbScope;

module.exports = e;
