let Scope = require('Scope');
let ResDef = require('ResDef');
let GameConfig = require('GameConfig');
let UIPanel = require('UIPanel');

const TAG_TIPS = 1;
const TAG_NORMAL = 2;

class OrderHelper
{
    constructor(mgr)
    {
        this.uimgr = mgr;
        this.depth = 0;
        this.Reset();
    }

    Reset()
    {
        this.chain = [];
    }

    Enter(name, node, order)
    {
        if (order == null)
        {
            ++this.depth;
            node.setLocalZOrder(this.depth);            
        }
        else
        {
            node.setLocalZOrder(order);
        }

        this.chain.push(name);
    }

    Leave(name, node, order)
    {
        if (order == null)
        {
            //--this.depth;
            // 暂时把配置表中的值改得非常大，以解决层次乱序的未知问题
        }

        let succ = false;
        for(let i= this.chain.length-1; i>=0; --i)
        {
            if (this.chain[i] == name)
            {
                this.chain.splice(i, 1);
                succ = true;
                break;
            }
        }

        let len = this.chain.length;
        if (succ && len > 0)
        {
            let topName = this.chain[len-1];
            let panel = this.uimgr.GetPanel(topName);
            if (panel)
            {
                panel.doFront();
            }
        }
    }
}

class UIManager
{
    constructor()
    {
    }

    Create(attachNode) 
    {
        this.panelDef = GameConfig.GetBase('panel_setting');

        // check live.
        for(let name in this.panelDef)
        {
            if ( this.panelDef[name].live == null)
            {
                console.error(name, "alive is nil!");
                return;
            }
        }

        this.orderHelper = new OrderHelper(this);

        let self = this;
        let scope = Scope.CreateCore('uimanager'); // 全局唯一

        scope.Listen("UIOpenPanel", function(args)
        {
            let [name, openArgs] = args;
            self.OpenPanel( { name: name, openArgs: openArgs, tag: TAG_NORMAL } );
        });

        scope.Listen("UIClosePanel", function(args)
        {
            let [name, closeArgs] = args;
       
            self.ClosePanel(name, closeArgs);
        });

        scope.Listen("UISwitchPanel", function(args)
        {
            let [name] = args;
            self.SwitchNormalPanel(name);
        });

        scope.Listen("UIOpenTips", function(args)
        {
            let [name, openArgs] = args;
            self.OpenPanel( { name: name, openArgs: openArgs, tag: TAG_TIPS } );
        });

        scope.Listen("UILookTips", (args)=>
        {
            let [name, openArgs] = args;
            self.OpenPanel( { name: name, openArgs: openArgs, tag: TAG_TIPS, forceOpen: true } );
        });

        scope.Listen("UICloseTips", function()
        {
            for(let i in self.panels)
            {
                let obj = self.panels[i];
                if (obj.GetTag() === TAG_TIPS)
                {
                    obj.Close();
                }
            }
        });

        scope.Listen('CloseAndLockUIOperator', function()
        {
            self.lockAndDisableOpUI = true;  // 禁止用户操作
            self.CloseAllNormalPanel();               
        });

        scope.Listen('UnlockUIOperator', function()
        {
            self.lockAndDisableOpUI = false; 
        });

        scope.Listen("UIDestroyLives", function(live)
        {
            self.UIDestroyLives(live);
        });

        this.panels = {};
        this.attachNode = attachNode;
    }

    UIShutdown()
    {
        this.orderHelper.Reset();
        this.attachNode.removeAllChildren();
        this.panels = {};
    }

    GetPanel(name)
    {
        return this.panels[name];
    }

    GetPanelChildNode(panelName, nodeName)
    {
        let p = this.panels[panelName]
        if (p != null)
        {
            return p.FindPanelChild(nodeName);
        }
    }

    // 彻底清除Panel，用于流程切换，游戏重载
    UIDestroyLives(live)
    {
        let list = this.panels;
        this.panels = {};
        for(let name in list)
        {
            let panel = list[name];
            if (panel.FindLive(live))
            {
                if (panel.panelNode != null)
                {
                    this.attachNode.removeChild(panel.panelNode);
                }
            }
            else
            {
                this.panels[name] = panel;
            }
        }
        this.orderHelper.Reset();
    }

    CloseAllNormalPanel()
    {
        for(let name in this.panels)
        {
            let obj = this.panels[name];
            if (!obj.IsStatic())
            {
                obj.Close();
            }
        }
    }
    
    ClosePanel(name, closeArgs)
    {
        let obj = this.panels[name]
        if (obj != null)
        {
            obj.Close();
        }
    }

    IsVisible(name)
    {
        let obj = this.panels[name]
        if (obj != null)
        {
            return obj.IsVisible();
        }
        
        return false;
    }

    SwitchNormalPanel(name)
    {
        let obj = this.panels[name]
        if (obj == null)
        {
            this.OpenPanel( { name: name, tag: TAG_NORMAL })
            return;
        }

        let config = this.panelDef[name];
        if (config.disableOnPlaying === 1 && this.lockAndDisableOpUI === true)
        {
            if (!obj.IsVisible())
            {
                return;
            }
        }

        obj.Switch();
    }

    OpenPanel(args)
    {
        const { name, openArgs, tag, forceOpen } = args;

        let config = this.panelDef[name]
        if (config == null)
        {
            cc.error( 'open panel fail, config not found!' + name);
            return;
        }

        if (config.disableOnPlaying === 1 && this.lockAndDisableOpUI === true)
        {
            if (forceOpen !== true)
            {
                return;
            }
        }

        let obj = this.panels[name]
        if (obj == null)
        {
            obj = new UIPanel(this.orderHelper, name, config, this.attachNode, tag);
            this.panels[name] = obj;
        }

        obj.Open(openArgs);
    }

    DebugCheck()
    {
        let allLen = Object.keys(this.panelDef).length;
        let count = 0;
        for(let name in this.panelDef)
        {
            let config = this.panelDef[name];
            let prefabUrl = ResDef.GetPanelPrefab(config.res);
            cc.loader.loadRes(prefabUrl, cc.Prefab, function(err, result)
            {
                if (err)
                {
                    console.warn('error');
                }
                else
                {
                    count ++;
                    console.warn(count.toString() + "/" + allLen.toString());
                }
            });
        }

    }
}

module.exports = new UIManager();
