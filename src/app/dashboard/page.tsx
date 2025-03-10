"use client";

import { useState } from "react";
import useCart from "@/app/hooks/useCart";
import Image from "next/image";
import { User, Mail, ShoppingBag, MapPin, Phone, Calendar } from "lucide-react";

export default function DashboardPage() {
  const { session } = useCart();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {/* Profile Card */}
      <div className='col-span-1'>
        <div className='bg-card rounded-lg border border-border p-6 space-y-6'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10'>
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full bg-primary/10 flex items-center justify-center'>
                  <User className='w-12 h-12 text-primary/60' />
                </div>
              )}
            </div>
            <div>
              <h2 className='text-xl font-semibold'>{session?.user?.name}</h2>
              <p className='text-sm text-muted-foreground'>
                {session?.user?.role}
              </p>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-3 text-muted-foreground'>
              <Mail className='w-4 h-4' />
              <span className='text-sm'>{session?.user?.email}</span>
            </div>
            <div className='flex items-center gap-3 text-muted-foreground'>
              <ShoppingBag className='w-4 h-4' />
              <span className='text-sm'>5 Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className='col-span-1 md:col-span-2'>
        <div className='bg-card rounded-lg border border-border p-6 space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Profile Details</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm text-muted-foreground'>Full Name</label>
              {session?.user?.name && (
                <input
                  type='text'
                  defaultValue={session?.user?.name || ""}
                  disabled={!isEditing}
                  className='w-full px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-70'
                />
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm text-muted-foreground'>Email</label>
              <input
                type='email'
                defaultValue={session?.user?.email || ""}
                disabled
                className='w-full px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-70'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm text-muted-foreground'>Phone</label>
              <input
                type='tel'
                placeholder='Add phone number'
                disabled={!isEditing}
                className='w-full px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-70'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm text-muted-foreground'>Address</label>
              <input
                type='text'
                placeholder='Add address'
                disabled={!isEditing}
                className='w-full px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-70'
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className='mt-8 bg-card rounded-lg border border-border p-6 space-y-6'>
          <h3 className='text-lg font-semibold'>Recent Activity</h3>
          <div className='space-y-4'>
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className='flex items-center gap-4 p-4 rounded-lg bg-accent/50'
              >
                <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <ShoppingBag className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Ordered iPhone 13 Pro</p>
                  <p className='text-xs text-muted-foreground'>2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
