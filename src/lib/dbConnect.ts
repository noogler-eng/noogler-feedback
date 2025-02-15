import mongoose from "mongoose";

type connectionObject = {
    isConnected: number
}

let connection: connectionObject = {
    isConnected: 0
}

async function handelConnection(): Promise<void>{
    if(connection.isConnected){
        console.log("-------database already connected-----");
        return;
    }else{
        try{
            const db = await mongoose.connect(process.env.MONGO_DB_URL || "", {});
            connection.isConnected = db.connections[0].readyState;
            console.log("db connecte susscefully");
        }catch(error){
            console.log("database connection error: ",error);
            process.exit(1);
        }
    }
}
export default handelConnection;

