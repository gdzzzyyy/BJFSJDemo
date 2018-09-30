const ResDef = require('ResDef');
const Scope = require('Scope');
const FireEvent = require('Eventer');
const UIHelper = require('UIHelper');

const ANINODENAME = '_ani';

class UIPanel
{
    constructor(orderHelper, name, config, attachNode, tag)
    {
        this.orderHelper = orderHelper;
        this.tag = tag;
        this.name = name;
        this.config = config;
        this.attachNode = attachNode;
        this.panelNode = null;        
        this.visible = false;  
    }

    BindVzbEvent()
    {
        if (this._vzbc_ != null)
        {
            this._vzbc_.SetActive(true);
            return;
        }

        this.panelNode._spd = { scope: this.vzbscope, name: this.name } ;

        if (this._vzbEvents != null)
        {
            for(let key in this._vzbEvents)
            {
                let value = this._vzbEvents[key];
                if (typeof(value) == "function")
                {
                    this.vzbscope.Listen(key, value);
                }
            }
        }
    }

    UnbindVzbEvent()
    {
        if (this.vzbscope != null)
        {
            this.vzbscope.SetActive(false);
            this._vzbc_ = this.vzbscope;
        }        
    }

    AttachScript(sobj)
    {
        this.scriptObj = sobj;

        if (sobj != null)
        {
            this._vzbEvents = sobj.__config.vzbEvents;
            this.vzbscope = Scope.Create("globe." + this.config.live + "." + this.name);
        }
    }

    IsVisible()
    {
        return this.visible == true;
    }

    Close(args)
    {
        if (!this.IsVisible())
        {
            return;
        }

        this.visible = false;

        if (this.panelNode != null)
        {
            this.doClose(args);
        }
    }

    IsStatic()
    {
        return this.config.static === 1;
    }

    FindLive(live)
    {
        if (this.config.live == null)
        {
            throw new Error()
        }
        let lives = (this.config.live || "").split(',');
        for(let i in lives)
        {
            if (lives[i] == live)
            {
                return true;
            }
        }

        return false;
    }

    Switch()
    {
        if (this.IsVisible())
        {
            this.Close(null);
        }
        else
        {
            this.Open(null);
        }
    }

    GetTag()
    {
        return this.tag;
    }

    Open(args)
    {
        if (this.IsVisible())
        {
            return;
        }

        this.visible = true;

        if (this.panelNode != null)
        {
            this.doOpen(args);
        }
        else
        {
            if (this.isLoading == true)
            {
                return;
            }
            
            let lastOpenArgs = args;
            this.isLoading = true;

            let prefabUrl = ResDef.GetPanelPrefab(this.config.res);
            FireEvent("ShowPanelBlock", true);
            cc.loader.loadRes(prefabUrl, cc.Prefab, (err, result)=>
            {
                FireEvent("ShowPanelBlock", false);

                if (err)
                {
                    cc.error(err.message || err);
                }
                else if (result != null && (result instanceof cc.Prefab))
                {
                    let newNode = cc.instantiate(result); // [ok] - 管理器，不用清理
                    this.attachNode.addChild(newNode);
                    this.panelNode = newNode;
                    newNode.vzbscope = this.vzbscope;
                    this.isLoading = false;                    

                    //newNode.
                    if (this.visible == true)
                    {
                        this.doOpen(lastOpenArgs);
                    }
                }
            })

            return;
        }
    }

    _playOpenAni()
    {
        let node = this.panelNode.getChildByName(ANINODENAME);
        if (node != null)
        {
            let ani = node.getComponent(cc.Animation);
            if (ani != null)
            {
                ani.play("uiopen", 0);
            }
        }
    }

    doFront()
    {
        if (this.scriptObj != null )
        {
            if (this.scriptObj.OnFront != null)
            {
                this.scriptObj.OnFront();
            }

            FireEvent("OnFront" + this.name);
        }
    }

    doOpen(args)
    {
        this.BindVzbEvent();
        this.panelNode.active = true;        
        if (this.scriptObj != null)
        {
            if ( this.scriptObj.OnOpen != null)
            {
                this.scriptObj.OnOpen(args);
            }
        }
        else
        {
            this.panelNode.emit('OnOpen', args);
        }

        this.orderHelper.Enter(this.name, this.panelNode, this.config.order);
        this._playOpenAni();

        this.doFront();

        FireEvent("OnPanelOpen", [this.name, args]);
    }

    doClose(args)
    {
        this.UnbindVzbEvent();
        this.orderHelper.Leave(this.name, this.panelNode, this.config.order);
        this.panelNode.active = false;        
        if (this.scriptObj != null)
        {
            if ( this.scriptObj.OnClose != null)
            {
                this.scriptObj.OnClose(args);
            }
        }
        else
        {
            this.panelNode.emit('OnClose', args);
        }        
    }

    FindPanelChild(name)
    {
        let p = name.indexOf('/');
        if (p <= 0)
        {
            return UIHelper.FindChild(this.panelNode, name);
        }

        let names = name.split('/');
        let root = this.panelNode;
        for(let i=0; i<names.length; ++i)
        {
            root = UIHelper.FindChild(root, names[i]);
            if (root == null)
            {
                return;
            }
        }

        return root;
    }
}

module.exports = UIPanel;
