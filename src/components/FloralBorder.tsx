const BLUE = "#7ba4c9";

export const FloralBorder = () => (
  <svg
    className="sticky top-0 left-0 w-full h-full pointer-events-none shrink-0"
    style={{ marginBottom: "-100%" }}
    viewBox="0 0 600 1000"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* ── Top-left corner cluster ── */}
    <g stroke={BLUE} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Large peony */}
      <path d="M80 30 Q95 10 110 25 Q125 5 135 28 Q150 12 148 35 Q165 25 155 48 Q170 45 158 60 Q145 55 140 68 Q130 58 120 65 Q115 50 105 58 Q95 48 88 55 Q80 45 80 30Z" />
      <circle cx="118" cy="42" r="6" />
      <path d="M110 42 Q118 36 126 42 M112 46 Q118 50 124 46" />

      {/* Bud cluster */}
      <path d="M50 55 Q55 40 65 50 Q60 38 70 42 Q65 55 55 58Z" />
      <path d="M55 58 Q50 75 48 90" />

      {/* Leaves on stem */}
      <path d="M48 70 Q38 62 32 72 Q42 72 48 70Z" />
      <path d="M50 82 Q60 74 65 84 Q56 82 50 82Z" />

      {/* Small wild rose */}
      <path d="M145 10 Q155 0 162 12 Q170 3 168 18 Q158 14 152 20 Q145 15 145 10Z" />

      {/* Trailing vine across top */}
      <path d="M80 30 Q60 25 40 30 Q20 35 10 28" />
      <path d="M40 30 Q35 22 28 26 Q36 28 40 30Z" />
      <path d="M60 27 Q55 18 48 22 Q56 24 60 27Z" />

      {/* Vine going down left side */}
      <path d="M10 28 Q5 50 12 80 Q8 110 15 140 Q10 170 18 200" />
      <path d="M12 55 Q2 48 0 58 Q8 55 12 55Z" />
      <path d="M10 90 Q0 82 -2 94 Q6 90 10 90Z" />
      <path d="M13 125 Q3 118 2 130 Q10 126 13 125Z" />
      <path d="M12 160 Q2 152 0 164 Q8 160 12 160Z" />

      {/* Small blossom top-left */}
      <path d="M25 48 Q32 38 40 46 Q35 52 28 55 Q22 52 25 48Z" />
      <circle cx="33" cy="47" r="2" />
    </g>

    {/* ── Top-right corner cluster ── */}
    <g stroke={BLUE} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Large open flower */}
      <path d="M520 25 Q535 5 550 20 Q565 0 572 22 Q590 10 582 35 Q598 30 588 50 Q575 42 568 55 Q555 45 545 55 Q535 42 525 50 Q515 38 520 25Z" />
      <circle cx="555" cy="35" r="7" />
      <path d="M548 35 Q555 28 562 35 M550 39 Q555 44 560 39" />

      {/* Bud */}
      <path d="M500 18 Q508 5 515 15 Q510 22 502 22Z" />
      <path d="M507 22 Q505 40 510 55" />
      <path d="M508 35 Q515 28 520 36 Q514 34 508 35Z" />

      {/* Branch across top */}
      <path d="M520 25 Q540 15 570 18 Q585 20 600 15" />
      <path d="M560 17 Q565 8 572 12 Q566 15 560 17Z" />

      {/* Anemone-style flower */}
      <path d="M475 40 Q485 25 498 38 Q492 48 482 50 Q474 48 475 40Z" />
      <path d="M498 38 Q510 32 505 48 Q498 44 498 38Z" />
      <circle cx="490" cy="42" r="3" />

      {/* Vine going down right side */}
      <path d="M600 15 Q595 45 588 75 Q592 110 585 145 Q590 178 582 210" />
      <path d="M590 50 Q600 42 602 54 Q594 50 590 50Z" />
      <path d="M587 90 Q598 82 600 95 Q592 90 587 90Z" />
      <path d="M588 130 Q598 122 600 135 Q592 130 588 130Z" />
      <path d="M586 170 Q596 162 598 175 Q590 170 586 170Z" />

      {/* Small leaves */}
      <path d="M540 12 Q545 2 552 10 Q546 14 540 12Z" />
    </g>

    {/* ── Bottom-left corner cluster ── */}
    <g stroke={BLUE} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Large peony */}
      <path d="M90 970 Q105 950 118 965 Q130 948 138 968 Q155 955 148 978 Q162 972 152 990 Q140 985 135 998 Q125 988 115 995 Q108 980 98 988 Q88 978 90 970Z" />
      <circle cx="122" cy="978" r="6" />
      <path d="M115 978 Q122 972 129 978 M117 982 Q122 987 127 982" />

      {/* Poppy-style flower */}
      <path d="M40 940 Q55 920 70 935 Q80 918 82 942 Q68 935 60 948 Q48 940 40 950 Q35 945 40 940Z" />
      <circle cx="62" cy="938" r="4" />

      {/* Butterfly */}
      <path d="M55 895 Q42 880 50 870 Q58 878 55 895Z" />
      <path d="M55 895 Q68 880 60 870 Q52 878 55 895Z" />
      <path d="M55 895 Q48 905 50 915" />
      <path d="M55 895 Q62 905 60 915" />
      <path d="M55 895 L55 920" />

      {/* Vine going up left side */}
      <path d="M18 800 Q10 830 15 860 Q8 890 20 920 Q15 945 40 940" />
      <path d="M15 830 Q5 822 2 835 Q10 830 15 830Z" />
      <path d="M12 865 Q2 858 0 870 Q8 865 12 865Z" />
      <path d="M16 900 Q6 892 4 905 Q12 900 16 900Z" />

      {/* Branch with berries */}
      <path d="M90 970 Q70 965 50 970 Q30 975 15 968" />
      <circle cx="35" cy="972" r="2.5" fill={BLUE} fillOpacity="0.2" />
      <circle cx="50" cy="970" r="2" fill={BLUE} fillOpacity="0.2" />
      <circle cx="65" cy="968" r="2.5" fill={BLUE} fillOpacity="0.2" />

      {/* Small leaves */}
      <path d="M30 958 Q22 948 18 960 Q26 958 30 958Z" />
      <path d="M68 960 Q62 950 58 962 Q64 960 68 960Z" />
    </g>

    {/* ── Bottom-right corner cluster ── */}
    <g stroke={BLUE} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
      {/* Large hibiscus-style flower */}
      <path d="M510 965 Q525 945 540 958 Q555 940 558 962 Q575 950 565 975 Q580 970 568 988 Q555 982 548 995 Q535 985 525 995 Q518 978 508 988 Q500 975 510 965Z" />
      <circle cx="540" cy="975" r="7" />
      <path d="M533 975 Q540 968 547 975 M535 980 Q540 985 545 980" />

      {/* Anemone */}
      <path d="M465 955 Q478 938 490 952 Q498 938 495 960 Q482 952 475 965 Q465 958 465 955Z" />
      <circle cx="480" cy="953" r="4" />

      {/* Butterfly */}
      <path d="M495 905 Q482 890 490 878 Q498 888 495 905Z" />
      <path d="M495 905 Q508 890 500 878 Q492 888 495 905Z" />
      <path d="M495 905 Q488 915 490 925" />
      <path d="M495 905 Q502 915 500 925" />
      <path d="M495 905 L495 928" />

      {/* Vine going up right side */}
      <path d="M582 810 Q590 840 585 870 Q592 900 580 930 Q585 955 565 975" />
      <path d="M586 840 Q596 832 598 845 Q590 840 586 840Z" />
      <path d="M584 875 Q594 868 596 880 Q588 875 584 875Z" />
      <path d="M588 910 Q598 902 600 915 Q592 910 588 910Z" />

      {/* Branch with buds */}
      <path d="M510 965 Q530 972 560 970 Q580 975 600 970" />
      <path d="M570 970 Q575 960 580 968 Q576 972 570 970Z" />

      {/* Daisy */}
      <path d="M555 938 Q562 928 568 938 Q575 930 572 942 Q565 938 558 945 Q552 940 555 938Z" />
      <circle cx="563" cy="937" r="2.5" />

      {/* Small leaf sprigs */}
      <path d="M530 958 Q535 948 540 956 Q536 960 530 958Z" />
      <path d="M585 945 Q592 935 596 945 Q590 948 585 945Z" />
    </g>
  </svg>
);
