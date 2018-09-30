
let allEvent = {} // 对象列表， 对象中，0=是否被删除， 1=对象
let allTimer = [] // Time列表，对象中， 0=是否被删除， 1=对象
let NOW_TIME = 0
let RTICK = 0
let GNAME = 1001001;

/**
 * Scope 核心组件:域
 * 用于以下
 * 1、创建域、清除域
 * 2、监听事件、发送事件
 */

function _removeTimer(t)
{
    for (let i = 1; i< allTimer.length; ++i)
    {
        if (allTimer[1] === t)
        {
            allTimer[0] = 0
        }
    }
}

function _addListen(name, f)
{
    let pool = allEvent[name]
    if (pool == null)
    {
        pool = []
        allEvent[name] = pool
    }
    pool.push( [1, f] ) // 1 = 有效
}

function _removeListen(name, f)
{
    let pool = allEvent[name]
    if (pool == null)
    {
        return
    }
    
    for( let index = 0; index < pool.length; index++)
    {
        let p = pool[index]
        if (p[1] == f )
        {
            p[0] = 0  // 0 = 无效
            return
        }
    } 
}

function _setActiveListen(name, f, active)
{
    let pool = allEvent[name]
    if (pool == null)
    {
        return
    }
    
    for( let index = 0; index < pool.length; index++)
    {
        let p = pool[index]
        if (p[1] == f )
        {
            p[0] = ( active === true ? 1 : 2 );  // 1=启用， 2=禁用
            return
        }
    }   
}

function _cleanupEvents()
{
    for (let k in allEvent) 
    {
        let evt = allEvent[k];
        for (let i=evt.length-1; i>=0; --i)
        {
            let v = evt[i]
            if (0 === v[0]) // 删除无效的元素
            {
                evt.splice(i, 1)
            }
        }
    }  
}

function _clearupTimer()
{
    for(let i=allTimer.length-1; i>=0; --i)
    {
        let tm = allTimer[i]
        if ( 0 === tm[0]) // 删除无效的元素
        {
            allTimer.splice(i, 1)
        }
    }
}

class Scope
{
    constructor(name)
    {   
        this.name = name
        this.events = []
        this.childs = []
    }

    Listen(eventName, callback)
    {
        _addListen(eventName, callback)
        this.events.push( [eventName, callback] )
    }

    SetActive(active)
    {
        for(let i=0; i<this.events.length; ++i)
        {
            let e = this.events[i]
            _setActiveListen(e[0], e[1], active)
        }

        for(let i=0; i<this.childs.length; ++i)
        {
            this.childs[i].SetActive(active)
        }

        if (active !== true)
        {
            _removeTimer(this); // TODO 临时清除
        }
    }

    Clear()
    {
        for(let i=0; i<this.events.length; ++i)
        {
            let e = this.events[i]
            _removeListen(e[0], e[1])
        }

        for(let i=0; i<this.childs.length; ++i)
        {
            this.childs[i].Clear()
        }

        this.events = []
        this.childs = []
        
        if ( this.timer != null )
        {
            _removeTimer(this)
            this.timer = null
        }
    }

    AddChild(name)
    {
        name = name || ((++GNAME).toString());

        let currChild = null
        for(let i=0; i<this.childs.length; ++i)
        {
            if (this.childs[i].name == name)
            {
                currChild = this.childs[i]
                break
            }
        }

        if (currChild == null)
        {
            currChild = new Scope(name)
            currChild.parent = this
            this.childs.push(currChild)
        }

        return currChild
    }

    find(name)
    {
        for(let i=0; i<this.childs.length; ++i)
        {
            if (this.childs[i].name === name)
            {
                return this.childs[i]
            }
        }

        return null
    }

    SetTimer(times, inv, f)
    {
        if ( typeof(f) != "function" )
        {
            throw new Error("f need function!")
            return
        }

        if (typeof(times) != "number" || typeof(inv) != "number")
        {
            throw new Error("times, inv, need number")
            return
        }

        if ( this.timer == null)
        {
            this.timer = []
            allTimer.push( [ 1, this]) // 置为有效
        }
        
        let obj =
        {
             inv : inv, 
             times : times,
             f : f,
             curr : NOW_TIME,
        }
        this.timer.push(obj)
    }

    Invoke(inv, f)
    {
        this.SetTimer(1, inv, f)
    }

    update()
    {
        if (this.timer == null)
        {
            return
        }

        for(let i=this.timer.length-1; i>=0; i--)
        {
            let tm = this.timer[i]
            if ( NOW_TIME - tm.curr - tm.inv >= 0 )
            {
                tm.f()

                if (this.timer == null)
                {
                    return
                }

                tm.curr = NOW_TIME;
                (tm.times > 0) &&  ((--tm.times)==0) && (this.timer.splice(i,1))
            }
        }
    }
}


let globeScope = new Scope("globe")

Scope.Create = function(addPath)
{
    if (null == addPath)
    {
        throw new Error("scope path is null!")
        return
    }

    let current = null
    let names = addPath.split('.')

    for(let i= 0; i< names.length; ++i)
    {
        let name = names[i]
        if (current == null)
        {
            if (name == "globe")
            {
                current = globeScope
            }
            else
            {
                throw new Error("scope path is invalid: "+ addPath)
                return
            }            
        }
        else
        {
            let newObj = current.AddChild(name)
            current = newObj
        }
    }

    return current
}

Scope.Clear = function(path)
{
    let c = this.Find(path)
    if (c != null)
    {
        c.Clear()
    }
}

Scope.Find = function(addPath)
{
    if (addPath == null)
    {
        return null
    }

    let current = null
    let names = addPath.split('.')
    for(let i= 0; i< names.length; ++i)
    {
        let name = names[i]
        if (current == null)
        {
            if (name == "globe")
            {
                current = globeScope
            }
            else
            {
                return null
            }
        }
        else
        {
            current = current.find(name)
        }
    }
    return current
}

Scope.Fire = function(name, args)
{
    let pool = allEvent[name]
    if (pool == null)
    {
        return
    }
    
    for( let i = 0; i < pool.length; i++)
    {
        let p = pool[i]
        if ( p[0] === 1 ) // 只对有效元素起作用
        {
            p[1](args)
        }
    }
}

Scope.Update = function(nowTime)
{
    NOW_TIME = nowTime

    for(let i= 0; i< allTimer.length; ++i)
    {
        let p = allTimer[i]
        if ( p[0] === 1) // 只有有效元素起使用
        {
            p[1].update()
        }
    }

    if (++RTICK >= 60)
    {
        RTICK= 0
        _cleanupEvents()
        _clearupTimer()
    }
}

Scope.CreateStage = function(name)
{
    return this.Create('globe.stage.' + name);
}

Scope.CreateStageBattle = function(name)
{
    return this.Create('globe.stage.battle.'+ name);
}

Scope.CreateLobby = function(name)
{
    return this.Create('globe.lobby.' + name);
}

Scope.CreateCore = function(name)
{
    return this.Create('globe.core.' + name);
}

Scope.CreateUI = function(name)
{
    return this.Create('globe.ui.' + name);
}

Scope.Report = function()
{
    //console.-log(globeScope);
    //console.-log(allEvent);
    //console.-log(allTimer);
}

module.exports = Scope


/**
 * 示例代码
 * let Scope = require('Scope')
 * 
 * scope:Invoke(5, function() {
 * })
 * scope:SetTimer(1, 2, function() {
 * })
 * scope:Clear()
 * 
 * scope:Listen('ActorDie', function(args) {
 *      let hp = args[0]
 * }
 * 
 * 
 */
