import {ObjectId} from 'mongodb'
import mongoose, {HydratedDocument, Model} from 'mongoose'
import {
    BlogType,
    CommentType,
    DeviceAuthSessionType,
    EmailConfirmationType,
    LikeStatus,
    RecoveryCodeType,
    TimeStampType,
    TokenType,
    UserType
} from '../types/types'
import {v4} from "uuid";

mongoose.set('strictQuery', true)
//const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017"
const mongoForMongooseUri = process.env.mongoForMongooseURI || "mongodb://0.0.0.0:27017/testDB"

//export const client = new MongoClient(mongoUri)

//let dbName = "testDB"
//let db = client.db(dbName)

//export const RecoveryCodeModelClass = db.collection<RecoveryCodeType>('recoveryCodes')

//todo --> move model logic to entity file
export type BlogMethodType = {
    caseInsRegexQuery: (code: string) => BlogType
}
type BlogModelType = Model<BlogType, {}, BlogMethodType>
type BlogModelStaticType = Model<BlogType> & {
    makeInstance(name: string, websiteUrl: string, description: string): HydratedDocument<BlogType, BlogMethodType>
}
type BlogModelFullType = BlogModelType & BlogModelStaticType

const BlogSchema = new mongoose.Schema<BlogType, BlogModelFullType>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: Date, required: true}
})
BlogSchema.method('caseInsRegexQuery', function caseInsRegexQuery(searchTerm) {
    return this.find({name: {$regex: searchTerm, $options: 'i'}})
})
BlogSchema.static('makeInstance', function makeInstance(
    name: string,
    websiteUrl: string,
    description: string) {
    return new BlogType(
        new ObjectId(),
        v4(),
        name,
        websiteUrl,
        description,
        new Date()
    )
})
export const BlogModelClass = mongoose.model<BlogType, BlogModelFullType>('blogs', BlogSchema)

const UserSchema = new mongoose.Schema<UserType>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: Date, required: true}
})
export const UserModelClass = mongoose.model('users', UserSchema)

const CommentSchema = new mongoose.Schema<CommentType>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: Date, required: true},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
        myStatus: {type: String, required: true}
    }
})
export const CommentModelClass = mongoose.model('comments', CommentSchema)

const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    userId: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})
export const EmailConfirmationModelClass = mongoose.model('emailConfirmations', EmailConfirmationSchema)

const BlackTokenSchema = new mongoose.Schema<TokenType>({
    token: {type: String, required: true}
})
export const BlackTokenModelClass = mongoose.model('blackTokens', BlackTokenSchema)

const DeviceAuthSessionSchema = new mongoose.Schema<DeviceAuthSessionType>({
    lastActiveDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    userId: {type: ObjectId, required: true},
    rtExpDate: {type: Date, required: true}
})
export const DeviceAuthSessionModelClass = mongoose.model('deviceAuthSessions', DeviceAuthSessionSchema)

const TimeStampSchema = new mongoose.Schema<TimeStampType>({
    route: {type: String, required: true},
    ip: {type: String, required: true},
    timeStamp: {type: Date, required: true}
})
export const TimeStampModelClass = mongoose.model('timeStamps', TimeStampSchema)

const RecoveryCodeSchema = new mongoose.Schema<RecoveryCodeType>({
    email: {type: String, required: true},
    recoveryCode: {type: String, required: true}
})
export const RecoveryCodeModelClass = mongoose.model('recoveryCodes', RecoveryCodeSchema)

const LikeStatusSchema = new mongoose.Schema<LikeStatus>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    likeStatus: {type: String, required: true}
})
export const LikeStatusModelClass = mongoose.model('likeStatuses', LikeStatusSchema)

export async function runDb() {
    try {
        // Connect the client to the server
        //await client.connect()
        await mongoose.connect(mongoForMongooseUri)

        console.log("Connected successfully to mongo server")

    } catch {
        console.log("Can't connect to db")
        // Ensures that the client will close when you finish/error
        //await client.close()
        await mongoose.disconnect()
    }
}