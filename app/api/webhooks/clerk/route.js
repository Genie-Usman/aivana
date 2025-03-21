import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { clerkClient } from '@clerk/nextjs';
import { createUser, updateUser, deleteUser } from '../../../../lib/actions/User.actions';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET is not defined in environment variables.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers.');
    return NextResponse.json({ error: 'Invalid request headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || 'no-email@example.com',
        username: username || `user_${id.slice(0, 6)}`,
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url || '',
      };

      const newUser = await createUser(user);

      if (newUser) {
        await clerkClient.users.updateUserMetadata(newUser.clerkId, {
          publicMetadata: { userId: newUser._id },
        });
      }

      return NextResponse.json({ message: 'User created successfully', user: newUser });
    }

    if (eventType === 'user.updated') {
      const { image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        username: username || `user_${id.slice(0, 6)}`,
        photo: image_url || '',
      };

      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    }

    if (eventType === 'user.deleted') {
      const deletedUser = await deleteUser(id);
      return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
    }

    console.log(`Unhandled webhook event: ${eventType}`);
    return NextResponse.json({ message: 'Event received but not handled' });
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
