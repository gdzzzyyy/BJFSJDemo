const ATLDIR = "Atlas/";
const CHARDIR = "Character/";
const PREFABDIR = "Prefab/";
const TABLEDIR = "resources/Table/"
const MAPDIR = "resources/Data/Map/"
const LEVELDIR = "resources/Data/Level/"
const AUDIO = "resources/Audio/"
const PANELDIR = "Panel/";
const TEXDIR = "Tex/";

class ResDef 
{
    GetCharPfb(name)
    {
        return CHARDIR + name;
    }

    GetAtlas(name)
    {
        return ATLDIR + name;
    }

    GetPrefab(name)
    {
        return PREFABDIR + name;
    }

    GetPanelPrefab(name)
    {
        return PANELDIR + name;
    }

    GetRawTable(name)
    {
        return TABLEDIR + name + ".json";
    }

    GetRawMap(name)
    {
        return MAPDIR + name + ".json";
    }

    GetRawLevel(name)
    {
        return LEVELDIR + name + ".json";
    }
    
    GetAudioRes(name)
    {
        return AUDIO + name + ".mp3";
    }

    GetTexRes(name)
    {
        return TEXDIR + name;
    }

    // 建筑的Atlas资源
    get buildAtlasUrl() 
    { 
        return ATLDIR + "build"; 
    }

    get lootAtlasUrl() 
    {
         return ATLDIR + "prop"; 
    }

    get propAtlasUrl() 
    {
        return ATLDIR + "prop"; 
    }

    get lobbyAtlasUrl() 
    {
        return ATLDIR + "lobby"; 
    }

    get battleAtlasUrl() 
    {
         return ATLDIR + "battle"; 
    }

    get mainUiAtlas() 
    {
         return ATLDIR + "main";
    }

    get floorAtlas()
    {
        return ATLDIR + "forest";
    }

    get headAtlas()
    {
        return ATLDIR + "head";
    }


    get friendControl() { return this.GetPrefab("FriendControls"); }
    get stagetMonsterAvatar() { return this.GetPrefab("StageMonsterAvatar"); };
    get prop100Prefab()  { return  this.GetPrefab("Prop100"); };
    get costpropPrefab()  { return  this.GetPrefab("CostProp100"); };
    get freeshop()  { return  this.GetPrefab("FreeShopProp"); };
    get FriendRewardControls()  { return  this.GetPrefab("FriendRewardControls"); };
    get shop100Prefab()  { return  this.GetPrefab("ShopProp100"); };
    get levelItemPrefab() { return this.GetPrefab("LevelUpItem"); }
    get floorPrefabUrl() { return  this.GetPrefab("MapFloorObj"); }
    get buildPrefabUrl() { return  this.GetPrefab("MapBuildObj"); }
    get lootPrefabUrl()  { return  this.GetPrefab("MapLootObj"); }
    get floorIdUrl()     { return  this.GetPrefab("MapIdObj"); }
    get battleStartUrl() { return  this.GetPrefab("NewFightStart"); }
    get labelButtonUrl() { return  this.GetPrefab("LabelButton"); }
    get shortcutPrefab() { return  this.GetPrefab("FastProp"); }
    get itemEffPrefab() { return this.GetPrefab("itemeffect"); }
    get buyPropItemPrefab() { return this.GetPrefab("BuyPropItem");}    
    get battleActorPrefabUrl() {return this.GetPrefab("BattleActorPerfab");}
    get stagePrefabUlr() { return this.GetPrefab("Stage"); }
    get levelFloorPrefabUrl() { return this.GetPrefab("LevelFloor"); }
    get achvItemPrefabUrl() { return this.GetPrefab('AchvItem');}
    get collItemPrefabUrl() { return this.GetPrefab('CollItem');}
    get heroHeadIconPrefabUrl() { return this.GetPrefab('HeroHeadIcon');}
    get monsterHeadIconPrefabUrl() { return this.GetPrefab('MonsterHeadIcon');}
    get rankItemPre() {return this.GetPrefab('RankItem');}
    get ranktip() {return this.GetPrefab('RankTip');}
    get rankRewardItemPre() {return this.GetPrefab('RankRewardItem');}
    get needPropPrefabUrl() { return this.GetPrefab('NeedProp');}
    get mailTitle() { return this.GetPrefab('MailItemPre');}
    get titleItemPrefab() {return this.GetPrefab("TitleItem");}
    get battleProp100() { return this.GetPrefab("BattleProp100"); }
    get numberFont() { return "Font/shuzi"; }
    get friendShopPrefab()  { return  this.GetPrefab("FriendShopProp"); };
    get heroLvupEff() { return this.GetPrefab("HireEft"); }
    get uilightEff() { return this.GetPrefab("Uplight");}
    get friendHeroItemPrefab() { return this.GetPrefab("FriendHeroItem")};

    get floorLevel() {return this.GetPrefab('wenzitexiao');}
    get hireEffPrefab() { return this.GetPrefab("UIchoujiang");}

}

module.exports= new ResDef();
