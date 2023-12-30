### *how to run 01_schema.sql*
1. go to ~/lightBnB
2. psql lightbnb (if you already created lightbnb database in postgres, otherwise create lightbnb database)
3. by running "\i migrations/01_schema.sql" -> you can drop existing tables and define schema
4. by running "\i seeds/02_seeds.sql" -> you can fill the empty tables with seeds
5. seeds/01_seeds.slq -> few manual seeds, you can pass it because we will run seeds/02_seeds.sql
