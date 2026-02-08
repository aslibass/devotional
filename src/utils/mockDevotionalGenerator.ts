import { Devotional, Day } from '../types';

export const mockDevotionalGenerator = async (day: Day): Promise<Devotional> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const devotionals: Record<Day, Devotional> = {
    presence: {
      day: 'presence',
      invocation: "Heavenly Father, open my heart to sense Your presence that fills every moment. Help me to be still and know that You are God, surrounding me with Your love. Amen.",
      scripture: {
        reference: "Psalm 139:7-10",
        text: "Where can I go from your Spirit? Where can I flee from your presence? If I go up to the heavens, you are there; if I make my bed in the depths, you are there. If I rise on the wings of the dawn, if I settle on the far side of the sea, even there your hand will guide me, your right hand will hold me fast."
      },
      reflection: "When did you last tangibly feel God's presence? What barriers might be preventing you from experiencing His nearness today?",
      physicalAction: "Close your eyes and place your hand over your heart. Take three deep breaths, imagining God's presence filling you with each inhale.",
      guidedPrayer: "Lord, I acknowledge that You are here, now, with me. Help me to sense Your presence throughout my day. When I feel alone, remind me that You never leave. When I feel afraid, help me feel Your protective embrace. When I feel joyful, let me share that joy with You. Make me increasingly aware of Your constant companionship. Amen.",
      truthToCarry: "I am never alone; God's presence goes with me everywhere.",
      benediction: "May the God who is ever-present bless you and keep you. May His face shine upon you today and give you peace. Go with the knowledge that wherever you are, He is there also. Amen."
    },
    healing: {
      day: 'healing',
      invocation: "Healing God, You bind up the brokenhearted and restore our wounded souls. Draw near to me now with Your gentle touch, revealing areas that need Your healing power. Amen.",
      scripture: {
        reference: "Psalm 147:3",
        text: "He heals the brokenhearted and binds up their wounds."
      },
      reflection: "What pain or wound are you carrying that needs God's healing touch? How might you open yourself to receive His restoration?",
      physicalAction: "Place your hands palms-up on your lap as a posture of receiving. Identify a specific area of pain in your body or heart, and imagine God's healing light touching that place.",
      guidedPrayer: "Gentle Healer, I bring before You my wounded places—both seen and unseen. You know where I hurt. You see my scars. I surrender these painful areas to Your loving care: [name specific wounds]. Pour Your healing balm over each one. Restore what has been broken. Renew what has been damaged. Where there is bitterness, plant forgiveness. Where there is trauma, bring peace. I receive Your healing work in me today. Amen.",
      truthToCarry: "God's healing power is at work in me, even in my deepest wounds.",
      benediction: "May the God who heals all your diseases bless and restore you. May His healing flow into every broken place, bringing wholeness and peace. Walk forward in the confidence that His healing work continues in you. Amen."
    },
    truth: {
      day: 'truth',
      invocation: "God of Truth, shine Your light into the darkened corners of my mind. Reveal any lies I've believed and replace them with Your liberating truth. Open my heart to receive what You want to show me today. Amen.",
      scripture: {
        reference: "John 8:31-32",
        text: "To the Jews who had believed him, Jesus said, 'If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.'"
      },
      reflection: "What lies have you been believing about yourself, God, or others? How have these falsehoods affected your life and relationships?",
      physicalAction: "Write down a lie you've believed on a piece of paper. Cross it out firmly, and write a corresponding truth from God's word beside it.",
      guidedPrayer: "Father of Light, thank You that You are the God of truth. I confess that I have believed lies about [name specific area]. These deceptions have kept me in bondage for too long. By Your Spirit, show me what is true. I renounce the lie that [specific lie]. I choose instead to believe that [God's truth]. Continue to transform my mind with Your truth. Help me to recognize lies quickly and replace them with Your perspective. Thank You for the freedom that comes through knowing and embracing Your truth. Amen.",
      truthToCarry: "God's truth is breaking chains of deception and setting me free.",
      benediction: "May the Spirit of Truth guide you into all truth today. May lies be exposed and fall away as God's perspective illuminates your path. Walk in the freedom that comes from knowing and living in God's truth. Amen."
    },
    integrated: {
      day: 'integrated',
      invocation: "Lord of all, I come before You as a whole person—body, mind, and spirit. Unite these dimensions of my being as I seek Your presence, receive Your healing, and embrace Your truth. Integrate Your work in every part of me. Amen.",
      scripture: {
        reference: "1 Thessalonians 5:23-24",
        text: "May God himself, the God of peace, sanctify you through and through. May your whole spirit, soul and body be kept blameless at the coming of our Lord Jesus Christ. The one who calls you is faithful, and he will do it."
      },
      reflection: "How have you compartmentalized your relationship with God? In what ways do you need a more integrated experience of His presence, healing, and truth?",
      physicalAction: "Stand with your feet firmly planted on the ground. Stretch your arms upward as if reaching toward heaven, then slowly bring them down to your heart, symbolizing the integration of heaven's reality into your whole being.",
      guidedPrayer: "God of wholeness, I acknowledge that You desire to work in every dimension of my life. Forgive me for the ways I've fragmented my faith, keeping You separate from certain areas. I invite Your presence into all aspects of my being—my thoughts, emotions, body, relationships, work, and rest. Heal the disconnected parts of my life. Reveal Your truth to my whole person. Make me integrated and whole as You are whole. I surrender all of myself to all of You. Amen.",
      truthToCarry: "God is making me whole as I experience His presence, healing, and truth together.",
      benediction: "May the God who makes you whole bless you completely—spirit, soul, and body. May His presence fill every corner of your life. May His healing touch every wounded place. May His truth illuminate every shadowed thought. Go in the wholeness that only He can provide. Amen."
    }
  };

  return devotionals[day];
};

export const mockImageGenerator = async (devotional: Devotional): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would call DALL-E API
  // For now, return a placeholder image based on the day
  const images = {
    presence: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg',
    healing: 'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg',
    truth: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    integrated: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg'
  };
  
  return images[devotional.day];
};