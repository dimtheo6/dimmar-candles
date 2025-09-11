// src/app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'aud' } = await req.json()

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50 AUD' },
        { status: 400 }
      )
    }

    // Create payment intent with specific payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card', 'afterpay_clearpay'], // Only allow cards and Afterpay
      metadata: {
        source: 'dimmar-candles-checkout',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}