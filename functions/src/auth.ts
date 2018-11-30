import * as admin from 'firebase-admin';
import * as functions from "firebase-functions";


export const db = admin.firestore();
export const is_admin = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try
    {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;
        const userDetails = await db.collection('users').doc(decodedIdToken.uid).get();
        if(!userDetails.data().roles.admin){
            throw new Error();
        }
        next();
        return;
    }
    catch(e) 
    {
        res.status(403).send('Unauthorized');
        return;
    }
}
export const create_user = async (request,response) => {
    try{
        const user = await admin.auth().createUser({
            email: request.body.email,
            password: request.body.password,
            emailVerified: false
        });
        await db.collection("users").doc(user.uid).create({
            uid: user.uid,
            roles: {
                customer: true,
                admin: false
            },
            email: user.email

        });
        response.sendStatus(201);
    }
    catch(error){
        console.log(error);
        response.status(400).send(error);
    }
}
export const get_all_users = async (request,response) => {}
export const get_user_info = async (request,response) => {}
export const delete_user = async (request,response) => {}
export const update_user_info = async (request,response) => {}
export const update_batch_users = async (request,response) => {}
export const delete_batch_users = async (request,response) => {}