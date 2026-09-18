
1. HomeHeroBackground.tsx
Your approach:
<View
  pointerEvents="none"
  style={styles.container}
>
  <Image
    source={require("../../assets/fff.png")}
    style={styles.image}
    resizeMode="cover"
    ...
  />
</View>
2. HomeScreen
Your approach:
<Screen>
  <HomeHeroBackground />

  <ScrollView>
    <View style={styles.heroSpacer} />

    {/* content */}
  </ScrollView>
</Screen>
What's GOOD about your code
1. The background is outside the ScrollView ✅
This is exactly right.
<Screen>
  <HomeHeroBackground />

  <ScrollView>
The image isn't part of the scrolling content, so it can remain fixed while the content moves.
That's the correct basic architecture.
2. pointerEvents="none" is excellent ✅
pointerEvents="none"
This is exactly what you asked for.
The artwork won't steal touches from buttons/cards placed over it.
3. Separate component is good engineering ✅
I like:
HomeHeroBackground
instead of putting all the image logic directly inside HomeScreen.
It keeps the Home screen readable and makes the artwork independently adjustable.
4. StyleSheet is perfectly reasonable here ✅
Even though your project uses NativeWind, I wouldn't force Tailwind classes onto everything.
For things like:
position: "absolute",
top: 0,
left: 0,
right: 0,
height: HERO_HEIGHT,
overflow: "hidden",
StyleSheet is actually very clear.
So I wouldn't change that just for the sake of using NativeWind.
5. Accessibility handling is thoughtful ✅
These:
accessibilityElementsHidden
importantForAccessibility="no-hide-descendants"
are appropriate for purely decorative artwork.
You don't want a screen reader treating your background image as meaningful content.




Now the important BAD part ❌










The second issue: HERO_HEIGHT = 260
You have:
const HERO_HEIGHT = 260;
This isn't inherently wrong.
But your image is 4:3.
A 4:3 image means:
width : height
4     : 3
So if your phone is 390 logical pixels wide:
390 × 3 / 4 = 292.5
Your artwork's natural proportional height is about 293 px, not 260.
On another phone:
430 × 3 / 4 = 322.5
Now it's ~323 px.
But you're forcing it into:
430 × 260
That changes the image container's aspect ratio.
And because you're using:
resizeMode="cover"
the image can crop.
This comment in your code is therefore incorrect:
"resizeMode="cover" ... no important portions are clipped regardless of screen width."
cover does not guarantee that.
It guarantees that the entire container is covered. If the container and image have different aspect ratios, cropping can happen.
That's an important distinction.
Third issue: duplicated 260
You currently have:
File 1
const HERO_HEIGHT = 260;
File 2
heroSpacer: {
  height: 260,
},
That means you have the same piece of information in two different places.
If you later change:
HERO_HEIGHT = 300;
but forget:
heroSpacer: {
  height: 260,
}
your layout breaks.
That's not something I'd keep in a production-quality implementation.
And there's another subtle issue
Your comment says:
"The hero background is rendered before the ScrollView ... so it underlays the scroll content."
That's generally true, but you're relying on the natural stacking order.
For a simple screen that's fine.
But I'd make the layering intention explicit when we build the final version:
Full-screen container
│
├── Background
│
└── ScrollView
The background is decorative and fixed; the ScrollView is the interactive layer.





One more important thing about "exactly the same" on iOS and Android
There's something I want to correct from my earlier answer.
You said:
"in every device it should look exactly the same."
We shouldn't promise pixel-for-pixel identical appearance across every phone. Different devices have different:
screen widths
aspect ratios
status-bar heights
display cutouts/notches
Android edge-to-edge behavior
iOS safe areas
What we can do is make the layout deterministic and responsive, so the artwork preserves its 4:3 ratio and behaves consistently across devices.
That's the professional approach.
