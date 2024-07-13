class cfg

{
    postDBLoad(container) 
    {   
		const logger = container.resolve("WinstonLogger");
	
		// get database from server
        const databaseServer = container.resolve("DatabaseServer");
		
		// Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();
	
        const areas = tables.hideout.areas;
				
		let modified = false;
        for (let _area in areas)
        {
            if ("stages" in areas[_area])
            {
				const stages = areas[_area].stages;
				for (let stage in stages)
				{ 
					if ("constructionTime" in stages[stage])
					{   
						stages[stage].constructionTime = 0;
						modified = true;
					}
				}
            }
        }
		if (modified) {
			logger.info(`Construction time successfully set to 0.`);
		}
    }
}

module.exports = {mod: new cfg};