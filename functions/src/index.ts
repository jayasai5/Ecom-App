import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as serviceAccount from "../../admin.json";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pickles-b26c9.firebaseio.com"
});
import * as auth from "./auth";
import * as catalog from "./catalog";

const app = express();
const main = express();

main.use('/api/v1', app);

export const webApi = functions.https.onRequest(main)



app.get('/users/:user_id', auth.get_user_info);
app.post('/users/', auth.create_user);
app.put('/users/:user_id', auth.update_user_info);
app.delete('/users/:userId', auth.delete_user);

app.get('/users/', auth.is_admin, auth.get_all_users);
app.put('/users/', auth.is_admin, auth.update_batch_users);
app.delete('/users/',auth.is_admin, auth.delete_batch_users);

app.get('/catalog/',catalog.get_items);
app.get('/catalog/:catalog_item_id', catalog.get_item);
app.post('/catalog/', auth.is_admin, catalog.create_item);
app.put('/catalog/:catalog_item_id', auth.is_admin, catalog.update_item);
app.delete('/catalog/:catalog_item_id', auth.is_admin, catalog.delete_item);


