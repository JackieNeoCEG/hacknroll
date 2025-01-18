// Import dependencies
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

// Define Gesture Description
export const gunGesture = new GestureDescription('gun');

// Thumb (No Curl, Horizontal Direction)
gunGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
gunGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
gunGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Index (No Curl, Horizontal Direction)
gunGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
gunGesture.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
gunGesture.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);

// Ring Finger (No Curl, Horizontal Direction)
gunGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
gunGesture.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1.0);
gunGesture.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1.0);

// Middle and Pinky (Full Curl, Neutral or Vertical Down Direction)
for (let finger of [Finger.Ring, Finger.Pinky]) {
  gunGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  gunGesture.addDirection(finger, FingerDirection.DiagonalDownLeft, 1.0);
  gunGesture.addDirection(finger, FingerDirection.DiagonalDownRight, 1.0);
}
