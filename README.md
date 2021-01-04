1. #### create file /config/config.json
make it look like This
`{
    "secret": "CHANGE TO YOUR SECRET CODE"
}
`
2. #### Recommended to create unique index in mongodb jsramverkproj collection called 'users'. unique index on 'user'

3. #### npm install
install dependencies

4. #### npm start
Server runs at port 4000


Backend är gjort på NodeJS Express för att den hanterar förfrågningar snabbt och funkar bra med JSON som används till APIET. Till databas används NoSQL MongoDB för dess flexibilitet då den inte har en fast struktur så är det enkelt att bygga ut. Det är inte den enda anledningen utan också för att mongoDB är dokumentbaserad med BJSON internt men funkar bra med att använd JSON för att kommunicera med databasen som sen omvandlar till BSON. Då vi har Javascript på både backend och frontend så fungerar det väldigt bra att använda sig av en databas som man kan skicka in och få ut JSON-svar.

För att skapa real-tids trading så används socket.io. Klienter kopplas till socketen och servern skickar automatiskt ut nytt värde för börsen till klienterna. 