# Feature

Quick Stock Purchase Experience

---

## Goal

Create a premium stock purchase experience that feels tactile, polished and satisfying while remaining extremely fast.

The experience should communicate confidence and ownership rather than simply confirming a transaction.

The interaction should feel closer to Apple Wallet, Arc Browser and modern fintech products than traditional banking software.

---

## Entry Point

The user has already selected a stock.

The purchase modal opens directly.

---

# State 1

Idle

## Components

• USD Wallet card
• Current wallet balance
• Stock card
• Amount input
• Estimated shares
• Disabled Buy Stock button

---

## Behaviour

The Buy button remains disabled.

Estimated shares remain at zero.

Wallet balance is static.

---

# State 2

Entering Amount

As the user types...

## Wallet Counter

Instead of immediately changing the wallet balance...

Animate the balance downward using a number tween.

Example

Wallet
$4,830

User types

$1,000

Animation

4830
↓

4720
↓

4550
↓

4380
↓

3830

Duration

≈300–500ms

The animation should ease naturally rather than counting linearly.

---

## Estimated Shares

Estimated shares update live.

The value animates with a number transition instead of replacing instantly.

---

## Buy Button

Once a valid amount exists

Button fades from disabled to active.

Do not simply swap colours.

Animate:

opacity

brightness

slight scale

Duration

≈180ms

---

# State 3

Processing Purchase

Clicking Buy Stock

Button compresses slightly.

Immediately transition to loading.

---

## Loading Animation

Goal

Communicate the stock is being transferred.

### Option A (Preferred)

Dollar icon remains fixed.

The red circular stock icon rolls in from the right.

It collides gently with the dollar icon.

Dollar icon shifts left by a few pixels from impact.

Dollar icon springs back.

The red icon settles.

Processing text fades underneath.

Examples

Purchasing shares...

Verifying transaction...

Registering ownership...

Generating certificate...

Done

Duration

≈1.3–1.8 seconds total.

Motion should feel physical rather than mechanical.

---

# State 4

Purchase Success

Congratulations message appears.

Fade upward.

Certificate scales from

96%

↓

100%

with slight overshoot.

---

## Certificate

Certificate behaves like a premium physical object.

### Cursor Tilt

Mouse movement rotates the certificate.

Max rotation

≈8°

Movement should interpolate smoothly.

Never snap.

---

## Depth

Certificate casts a dynamic shadow.

Shadow changes based on rotation.

---

## Paper Shine

While hovering

A subtle light sweeps across the paper.

The shine moves opposite the tilt direction.

Keep opacity very low.

Avoid looking metallic.

Think textured paper catching light.

---

## Download Button

Hover

Lift

Shadow increase

Arrow slides slightly

Click

Tiny compression

Then begins download animation.

---

# Download Animation

The certificate should appear to return into the application.

Reference

macOS document minimization animation.

Behaviour

Certificate bends inward.

Edges become slightly concave.

Scale decreases rapidly.

Perspective increases.

Certificate accelerates toward the stock icon.

Disappear into the icon.

The animation should imply

Ownership has been stored.

Duration

≈700ms

---

# State 5

Confirmation

Message

Your certificate is now in your email.

Portfolio cards appear.

---

## Hover Behaviour

Hovering a card

Scale

≈1.04

Shadow increases.

Neighbouring cards subtly move away.

Reveal CTA

Buy this Stock →

CTA slides upward.

Opacity

0 → 100%

Arrow shifts forward on hover.

Exit animation mirrors entrance.
