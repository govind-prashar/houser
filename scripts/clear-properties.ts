import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Deleting all properties...')
    
    const deleteCount = await prisma.property.deleteMany({})
    
    console.log(`Deleted ${deleteCount.count} properties successfully!`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

