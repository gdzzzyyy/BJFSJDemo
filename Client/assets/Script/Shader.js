
const libs = {};

const ShaderSet = (sprite, shaderName) =>
{
    let glp = libs[shaderName];
    if (glp == null)
    {
        const ShaderLib = require('ShaderLib');
        const cfg = ShaderLib[shaderName];

        glp = new cc.GLProgram();
        glp.initWithString(cfg.v, cfg.p);
        
        if (!cc.sys.isNative) 
        { 
            glp.initWithVertexShaderByteArray(cfg.v, cfg.p);
            glp.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);  
            glp.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);  
            glp.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);  
        }
        glp.link();  
        glp.updateUniforms();
        libs[shaderName] = glp;
    }

    sprite._sgNode.setShaderProgram(glp);
}

module.exports = ShaderSet;
