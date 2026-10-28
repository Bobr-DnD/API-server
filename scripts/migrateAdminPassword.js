// One-off migration: adds the new `adminPassword` field to existing sessions
// that predate the admin/player credential split.
//
// It copies the current (bcrypt-hashed) `password` into `adminPassword` as a
// stopgap so existing sessions keep working, then logs the affected session
// names. The GM of each session should change the admin password afterwards
// via the "Змінити пароль майстра" form - it is currently identical to the
// player password and must not stay that way.
//
// Usage: node scripts/migrateAdminPassword.js [--local]

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Session from '../schemas/sessionSchema.js'

dotenv.config({ path: './.env' })

const useLocal = process.argv.includes('--local')
const mongoUrl = useLocal ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL_WEB

async function migrate() {
    await mongoose.connect(mongoUrl)

    const sessions = await Session.find().select('+password +adminPassword name')
    let migrated = 0

    for (const session of sessions) {
        if (session.adminPassword) continue

        await Session.updateOne(
            { _id: session._id },
            { $set: { adminPassword: session.password } }
        )

        console.log(`Migrated session "${session.name}" (${session._id}) - set adminPassword = current password`)
        migrated++
    }

    console.log(`Done. ${migrated} of ${sessions.length} session(s) migrated.`)
    await mongoose.disconnect()
}

migrate().catch((error) => {
    console.error(error)
    process.exit(1)
})
