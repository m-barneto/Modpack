import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { IDHelper } from "./IDHelper";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class BoostedMeds implements IPostDBLoadMod
{
    private logger: ILogger
    private mod: string

    constructor() {
        this.mod = "BoostedMeds"; // Set name of mod so we can log it to console later
    }

    preAkiLoad(container: DependencyContainer): void 
    {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);
    }
    
    public postDBLoad(container: DependencyContainer): void 
    {
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const idHelper = new IDHelper;

        // Get all the in-memory json found in /assets/database
        const tables: IDatabaseTables = databaseServer.getTables();

        // Find the item by its Id
        //Painkillers
        const morphine = tables.templates.items[idHelper.MORPHINE];
        const analgin = tables.templates.items[idHelper.ANALGIN];
        const augmentin = tables.templates.items[idHelper.AUGMENTIN];
        
        //Healers
        const carKit = tables.templates.items[idHelper.CAR_FIRST_AID];
        const salewa = tables.templates.items[idHelper.SALEWA];
        const ifak = tables.templates.items[idHelper.IFAK];
        const afak = tables.templates.items[idHelper.AFAK];
        const grizzly = tables.templates.items[idHelper.GRIZZLY];

        //Restorers
        const calocB = tables.templates.items[idHelper.CALOC_B];
        const armyBandages = tables.templates.items[idHelper.ARMY_BANDAGE];

        //Stims
        const l1 = tables.templates.items[idHelper.L1_INJECTOR];
        const propital = tables.templates.items[idHelper.PROPITAL];
        const sj1 = tables.templates.items[idHelper.SJ1];
        const sj6 = tables.templates.items[idHelper.SJ6];
        const etg = tables.templates.items[idHelper.ETG];
        const btg3 = tables.templates.items[idHelper.BTG_3];
        const p22 = tables.templates.items[idHelper.P22];
        const ahf1 = tables.templates.items[idHelper.AHF1];
        const mule = tables.templates.items[idHelper.MULE];
        const sj9 = tables.templates.items[idHelper.SJ9];
        const sj12 = tables.templates.items[idHelper.SJ12];
        const pnb = tables.templates.items[idHelper.PNB];
        const trimadol = tables.templates.items[idHelper.TRIMADOL];
        const perfotoran = tables.templates.items[idHelper.PERFOTORAN];
        const adrenaline = tables.templates.items[idHelper.ADRENALINE];
        const zagustin = tables.templates.items[idHelper.ZAGUSTIN];
        const antidote = tables.templates.items[idHelper.XTG];
        const meldonin = tables.templates.items[idHelper.MELDONIN];
        const cocktail1 = tables.templates.items[idHelper.COCKTAIL_INJECTOR];
        const cocktail2 = tables.templates.items[idHelper.COCKTAIL2_INJECTOR];
        const new2a2 = tables.templates.items[idHelper.NEW2A2];

        const stimArray = 
        [
            l1,
            propital,
            sj1,
            sj6,
            etg,
            btg3,
            p22,
            ahf1,
            mule,
            sj9,
            sj12,
            pnb,
            trimadol,
            perfotoran,
            adrenaline,
            zagustin,
            antidote,
            meldonin,
            cocktail1,
            cocktail2,
            new2a2
        ];

        // Update one of its properties
        //Painkillers
        morphine._props.MaxHpResource = 3;
        analgin._props.MaxHpResource = 10;
        augmentin._props.MaxHpResource = 15;

        //Healers
        carKit._props.MaxHpResource = 240;
        salewa._props.MaxHpResource = 650;
        ifak._props.MaxHpResource = 350;
        afak._props.MaxHpResource = 450;

        //Restorers
        calocB._props.MaxHpResource = 6;
        armyBandages._props.MaxHpResource = 4;

        //Stims
        stimArray.forEach(function(stim)
        {
            stim._props.MaxHpResource = 2;
        }
        );

        
        //Add heavy bleeding cure to car kit
        carKit._props.effects_damage = {
            "LightBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 50
            },
            "HeavyBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 100
            }
        };

        salewa._props.effects_damage = {
            "LightBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 15
            },
            "HeavyBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 30
            }
        };

        ifak._props.effects_damage = {
            "LightBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 35
            },
            "HeavyBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 70
            }
        };

        afak._props.effects_damage = {
            "LightBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 25
            },
            "HeavyBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 50
            }
        };

        grizzly._props.effects_damage = {
            "LightBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 10
            },
            "HeavyBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 20
            },
            "Contusion":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            },
            "Fracture":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 25
            },
            "RadExposure":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 0
            }
        };

        armyBandages._props.effects_damage = {
            "LightBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0
            },
            "HeavyBleeding":{
                delay: 0,
                duration: 0,
                fadeOut: 0,
                cost: 1
            }
        };
    }
}

module.exports = { mod: new BoostedMeds() }