const FireEvent = require('Eventer');
const SetShader = require("Shader");

/**
 * ButtonEventer
 * 按钮类
 * 它可以替代Cocos的Button
 * EvtName为事件名，EvtArgs为事件参数体，参数体必须为JSON格式
 */
cc.Class({
    extends: cc.Component,

    properties: 
    {
        EvtName: "",
        EvtArgs: "",
    },

    OnClick()
    {        
        if (this.EvtName.length > 0)
        {
            let eobj = this.customEvtObj || this.evtObj;
            FireEvent(this.EvtName, eobj);
        }
    },

    SetCustomEvtObj(obj)
    {
        this.customEvtObj = obj;
    },

    SetCustomEvtName(fireName)
    {
        this.EvtName = fireName;
    },

    SetBtnActive(bool)
    {
        let btn = this.node.getComponent(cc.Button);
        if(btn == null)
        {
            btn = this.node.addComponent(cc.Button);
            
            if (this.disableScale !== false)
            {
                btn.transition = cc.Button.Transition.SCALE;
                btn.duration = 0.1;
                btn.zoomScale = 1.2;
            }
        } 
        btn.interactable = bool;        
    },

    SetBtnGray(bool,text)
    {
        this.SetBtnActive(!bool);
        let sprite = this.node.getComponent(cc.Sprite);
        if (sprite != null)
        {
            SetShader(sprite, bool ? "gray" : "normal");
        }

        let bst = this.node.getComponent('ButtonStyleText');
        if (bst != null)
        {
            bst.ShowGrayText(bool,text);
        }
    },

    SetBtnGrayOnly(bool)
    {
        let sprite = this.node.getComponent(cc.Sprite);
        if (sprite != null)
        {
            SetShader(sprite, bool ? "gray" : "normal");
        }
    },

    SetScaleEnable(enable)
    {
        this.disableScale = enable;

        let btn = this.node.getComponent(cc.Button);
        if (btn != null)
        {
            btn.transition = cc.Button.Transition.NONE;
        }
    },

    start () 
    {
        let btn = this.node.getComponent(cc.Button);
        if (btn == null)
        {
            btn = this.node.addComponent(cc.Button);
            
            if (this.disableScale !== false)
            {
                btn.transition = cc.Button.Transition.SCALE;
                btn.duration = 0.1;
                btn.zoomScale = 1.2;
            }
        }
        
        let e = this.node.getComponent(cc.Component.EventHandler);
        if (e == null)
        {
            let e = new cc.Component.EventHandler();
            e.target = this.node;
            e.component = "ButtonEventer";
            e.handler = "OnClick";
            btn.clickEvents.push(e);
        }

        if (this.EvtArgs.length > 0)
        {
            let value = null;
            try
            {
                value = JSON.parse(this.EvtArgs);
            }
            catch(er)
            {
                cc.error(er);
                value = null;
            }

            if ( value != null && value instanceof Array)
            {
                this.evtObj = value;
            }
            else
            {
                cc.error(this.node.name + ' => ButtonEventer args is not Array!');
            }
        }
    },
    
});
