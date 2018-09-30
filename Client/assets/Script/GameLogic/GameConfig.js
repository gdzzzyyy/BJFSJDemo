
class GameConfig
{
    Load(callback)
    {
        let count= 0;
        let finish = ()=>
        {
            if (++count == 3)
            {
                callback();
            }
        }

        this.baseCfg = {};
        cc.loader.load(cc.url.raw("resources/Data/Config/base.json"), (err, data)=>
        {
            if(err)
            {
                console.error(err.message || err);
            }
            else
            {
                this.baseCfg = data;
                finish();
            }
        });

        this.language = {};
        cc.loader.load(cc.url.raw("resources/Data/Config/lang.json"), (err, data)=>
        {
            if(err)
            {
                console.error(err.message || err);
            }
            else
            {
                this.language = data;
                finish();
            }
        });

        
        this.randomMap = {};
        this.randomKeyMap = [];
        cc.loader.load(cc.url.raw("resources/Data/Config/randomMapConfig.json"), (err, data)=>
        {
            if(err)
            {
                console.error(err.message || err);
            }
            else
            {
                this.randomMap = data;
                for(let i in data)
                {
                    this.randomKeyMap.push(parseInt(i));
                }
                this.randomKeyMap.sort(function(x, y)
                {
                    if(x < y)
                    {
                        return -1;
                    } 
                    else if (x > y)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                });
                finish();
            }
        });
    }

    GetBase(key)
    {
        return this.baseCfg[key];
    }

    GetLang(key)
    {
        return this.language[key];
    }

    GetRandomMap(floorlevel)
    {
        if(this.randomKeyMap.includes(floorlevel))
        {
            return this.randomMap[floorlevel.toString()];
        }
        else
        {
            this.randomKeyMap.push(floorlevel);
            this.randomKeyMap.sort(function(x, y)
            {
                if(x < y)
                {
                    return -1;
                } 
                else if (x > y)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            });
            let key = this.randomKeyMap.indexOf(floorlevel);
          
            this.randomKeyMap.splice(key, 1);
            
            if(key > 0)
            {
                return this.randomMap[this.randomKeyMap[key - 1].toString()];
            }
            else
            {
                return this.randomMap[this.randomKeyMap[key].toString()];
            }
            
            
        }

        
    }
}

module.exports = new GameConfig();