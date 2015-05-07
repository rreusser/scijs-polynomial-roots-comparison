# poly roots comparison

A quick script (ugly. seriously ugly) to compare the speed and accuracy of a few polynomial root-finding methods in the [scijs](https://github.com/scijs) toolbox.

## Summary:

I got a little sidetracked on a couple issues because there appears to be a case in which the companion matrix method loses all digits of precision, and a case in which it's pretty precise but (perhaps) totally inaccurate (see: scijs/companion-roots#1 ). This might be a case of that geometric vs. algebraic multiplicity stuff I can never keep straight with eigenvalues, or it might be something else entirely. Or I could be totally wrong.

The Durand-Kerner method is blazing fast. Except it struggles with closely spaced roots as in case 6. Otherwise it's pretty outstanding, but I suspect maybe there are robustness issues including sensitivity to initial guesses (perhaps a red flag for black box solvers) (and maybe scaling issues — like how do you choose good guesses for roots that span orders of magnitude? does it lose lots of precision in these cases?) that prevent it from being the go-to method for these things.

Jenkins-Traub brings up the rear on timing, at least until you get to large problems. It chugs along pretty respectably and doesn't fall over in these cases, although I'm sure there are plenty of corner cases where it could struggle. Its strength is in needing no input and proceeding from the smallest roots so that precision isn't lost.

An interesting note:

D-K chokes pretty badly on case 6, returning:

```
1 -7.981039600486516e-18
-0.9999887619012027 0.00038412524677635475
-0.9999887619012027 0.00038412524677635475
-0.9999887619012027 0.00038412524677635475
```

for the four roots. Technically it achieves four digits of precision, but it'd be interesting to see what the threshold is for roots snapping to numerically identical.

Okay, here are some numbers:

```
                        Method                Time               Error

1)  z - 6:
                 Jenkins-Traub          0.18021 ms         0.00000e+00
                 Durand-Kerner          0.01288 ms         2.22045e-16
              Companion Matrix          0.06486 ms         0.00000e+00

2)  z^2 + 1:
                 Jenkins-Traub          0.25117 ms         1.07203e-18
                 Durand-Kerner          0.04905 ms         0.00000e+00
              Companion Matrix          0.84850 ms         3.14208e-16

3)  z^2 + 2z - 3:
                 Jenkins-Traub          0.17595 ms         1.08792e-22
                 Durand-Kerner          0.04448 ms         5.88876e-17
              Companion Matrix          0.15792 ms         1.35064e-15

4)  z^3 - 4z^2 + z + 6:
                 Jenkins-Traub          0.29488 ms         6.43045e-21
                 Durand-Kerner          0.02057 ms         2.31972e-16
              Companion Matrix          0.50635 ms         3.51259e-15

5)  z^3 - (4+i)z^2 + (1+i)z + (6+2i):
                 Jenkins-Traub          0.21368 ms         2.65217e-16
                 Durand-Kerner          0.00407 ms         1.24919e-16
              Companion Matrix          0.38835 ms         1.41421e+00

6)  (z-1) * (z+1) * (z + 1 + 1e-4i) * (z + 1 - 1e-4i):
                 Jenkins-Traub          0.35790 ms         3.05511e-08
                 Durand-Kerner          0.02325 ms         6.90018e-04
              Companion Matrix         29.76010 ms         6.79238e-08

7)  (x-1000000)*(x+%i)*(x-%i):
                 Jenkins-Traub          0.19570 ms         7.58889e-19
                 Durand-Kerner          0.00867 ms         3.83997e-11
              Companion Matrix          0.53090 ms         7.01365e-10

8)  (z-1)(z-2)(z-3)(z-4)(z-5)(z-6)(z-7)(z-8)(z-9)(z-10):
                 Jenkins-Traub          0.83523 ms         4.45072e-10
                 Durand-Kerner          0.17730 ms         3.32534e-10
              Companion Matrix         18.65999 ms         1.41236e+00

9)  z^20 + i * z^10 + 1:
                 Jenkins-Traub          2.23841 ms
                 Durand-Kerner          0.13878 ms
              Companion Matrix         64.20926 ms
```

