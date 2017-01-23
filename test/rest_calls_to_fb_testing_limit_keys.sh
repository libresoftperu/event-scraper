

//PATCH https://hotleads.firebaseio.com/contacts.json
//{ "EXCELSOFTSOURCESCOM_RUSSELLORMES": { ".priority":"RUSSELL ORMES   ", "email":"russell.ormes@excelsoftsources.com", "fnam":"Russell", "lnam":"Ormes", "company":"RLabs" } }


curl -X PATCH -d '{ "runnymedeburnstoodlescom": { ".priority":"runnymedeburns", "email":"runnymedeburns@toodles.com", "fnam":"Runnymede", "lnam":"Burns", "company":"toodlesltd" } }' https://hotleads.firebaseio.com/contacts.json

curl -X PATCH -d '{ "russellormesexcelsoftsourcescom": { ".priority":"russellormes", "email":"russell.ormes@excelsoftsources.com", "fnam":"Russell", "lnam":"Ormes", "company":"excelsoftsources" } }' https://hotleads.firebaseio.com/contacts.json

curl -X PATCH -d '{ "russelljonestoodlescom": { ".priority":"russelljones", "email":"russelljones@toodles.com", "fnam":"Russell", "lnam":"Jones", "company":"toodlesltd" } }' https://hotleads.firebaseio.com/contacts.json

curl -X PATCH -d '{ "reinexcelsoftsourcescom": { ".priority":"reinpetersen", "email":"rein@excelsoftsources.com", "fnam":"Rein", "lnam":"Petersen", "company":"excelsoftsources" } }' https://hotleads.firebaseio.com/contacts.json

curl -X PATCH -d '{ "kirkexcelsoftsourcescom": { ".priority":"kirkholcomb", "email":"kirk@excelsoftsources.com", "fnam":"Kirk", "lnam":"Holcomb", "company":"excelsoftsources" } }' https://hotleads.firebaseio.com/contacts.json


curl 'https://hotleads.firebaseio.com/contacts.json?orderBy="$key"&startAt="b"&endAt="b~"&print=pretty'

curl 'https://hotleads.firebaseio.com/contacts.json?orderBy="$key"&startAt="r"&endAt="r~"&print=pretty'

curl 'https://hotleads.firebaseio.com/contacts.json?orderBy="$key"&startAt="ru"&endAt="ru~"&print=pretty'

curl 'https://hotleads.firebaseio.com/contacts.json?orderBy="$key"&startAt="russellj"&endAt="russellj~"&print=pretty'
