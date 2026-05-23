
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@canderra.com' },
        update: {
            role: 'ADMIN', // Ensure role is set to ADMIN
        },
        create: {
            email: 'admin@canderra.com',
            name: 'Admin User',
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=admin',
            role: 'ADMIN',
        },
    })

    // Create Host
    const host = await prisma.user.upsert({
        where: { email: 'host@example.com' },
        update: {},
        create: {
            email: 'host@example.com',
            name: 'Alice Host',
            password: hashedPassword,
            image: 'https://i.pravatar.cc/150?u=host',
            role: 'USER',
        },
    })

    // Helper to generate multiple images
    // Using specific high-quality Unsplash IDs
    const properties = [
        {
            title: 'Modern Apartment in Downtown',
            description: 'Experience city living at its finest in this stunning modern apartment. Floor-to-ceiling windows offer breathtaking views of the skyline. The open-concept living area is perfect for entertaining, featuring a state-of-the-art kitchen and stylish furnishings.',
            price: 180,
            location: 'New York, NY',
            type: 'Apartment',
            amenities: JSON.stringify(['Wi-Fi', 'AC', 'Kitchen', 'Gym', 'Elevator']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1556912173-3db9963eecc4?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 2,
            rating: 4.85,
            hostId: host.id,
        },
        {
            title: 'Cozy Villa with Private Pool',
            description: 'Escape to your own private oasis. This charming villa features a heated pool, lush tropical gardens, and a spacious patio for alfresco dining. The interior is professionally decorated with a blend of modern and rustic elements.',
            price: 450,
            location: 'Los Angeles, CA',
            type: 'Villa',
            amenities: JSON.stringify(['Pool', 'Wi-Fi', 'Parking', 'BBQ', 'Hot Tub']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 6,
            rating: 4.95,
            hostId: host.id,
        },
        {
            title: 'Mountain Retreat House',
            description: 'A spectacular mountain home with panoramic views of the Rockies. Enjoy ski-in/ski-out access in winter and endless hiking trails in summer. Features a massive stone fireplace and a gourmet kitchen.',
            price: 320,
            location: 'Denver, CO',
            type: 'House',
            amenities: JSON.stringify(['Fireplace', 'Hiking', 'Wi-Fi', 'Ski-in/Ski-out']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1520608421741-68228b76b6df?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 8,
            rating: 4.90,
            hostId: host.id,
        },
        {
            title: 'Seaside Beach Bungalow',
            description: 'Wake up to the sound of waves in this adorable beachfront bungalow. Direct beach access, a large deck for sunset watching, and a cozy interior make this the perfect getaway.',
            price: 250,
            location: 'Malibu, CA',
            type: 'Cabin',
            amenities: JSON.stringify(['Beach Access', 'Wi-Fi', 'Deck', 'Parking']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 4,
            rating: 4.75,
            hostId: host.id,
        },
        {
            title: 'Luxury Loft in Arts District',
            description: 'A massive industrial loft converted into a luxury living space. High ceilings, exposed brick, and a curated art collection. Located steps away from the best galleries and restaurants.',
            price: 210,
            location: 'Chicago, IL',
            type: 'Apartment',
            amenities: JSON.stringify(['Wi-Fi', 'Smart TV', 'Kitchen', 'Work Space']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1502005229766-939760a7cb0d?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 2,
            rating: 4.82,
            hostId: host.id,
        },
        {
            title: 'Rustic Cabin by the Lake',
            description: 'Unplug and unwind in this authentic log cabin. Features a private dock, canoe, and fire pit. The perfect spot for fishing, swimming, or just reading a book by the fire.',
            price: 180,
            location: 'Lake Tahoe, NV',
            type: 'Cabin',
            amenities: JSON.stringify(['Lake Access', 'Canoe', 'Fire Pit', 'Kitchen']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1533575916050-ff998eb82012?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 5,
            rating: 4.88,
            hostId: host.id,
        },
        {
            title: 'Glass House in the Forest',
            description: 'Immerse yourself in nature in this unique glass house. Surrounded by towering trees, you will feel completely secluded while enjoying modern comforts.',
            price: 400,
            location: 'Portland, OR',
            type: 'House',
            amenities: JSON.stringify(['Wi-Fi', 'Kitchen', 'Parking', 'Nature Views']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1510097467424-270d754be5aa?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1513584685908-7827be827915?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 2,
            rating: 4.92,
            hostId: host.id,
        },
        {
            title: 'Penthouse with Infinity Pool',
            description: 'The ultimate luxury experience. This penthouse features a private infinity pool overlooking the ocean, 3 bedrooms with ensuite bathrooms, and 24/7 concierge service.',
            price: 950,
            location: 'Miami, FL',
            type: 'Villa',
            amenities: JSON.stringify(['Pool', 'Concierge', 'Gym', 'Wi-Fi', 'Bar']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1512918760383-5645371561c8?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1571939228382-b2f2b58ea1e5?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 6,
            rating: 5.0,
            hostId: host.id,
        },
        {
            title: 'Historic Townhouse in Charleston',
            description: 'Step back in time in this beautifully preserved historic townhouse. Original hardwood floors, high ceilings, and antique furnishings meet modern amenities.',
            price: 280,
            location: 'Charleston, SC',
            type: 'House',
            amenities: JSON.stringify(['History', 'Garden', 'Wi-Fi', 'Kitchen']),
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1534595460031-d796a626a628?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=1200',
                'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200'
            ]),
            maxGuests: 4,
            rating: 4.78,
            hostId: host.id,
        }
    ]

    for (const p of properties) {
        await prisma.property.create({
            data: p,
        })
    }

    console.log('Seeding finished.')
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
