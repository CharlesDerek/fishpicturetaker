export function getFishThumbnail(className) {
	const images = getAllImages(className)
	const thumbnailIndex = 0;
	return images === null ? null : images[thumbnailIndex];
}

export function getFishImage(className) {
	const images = getAllImages(className)
	const imageIndex = 1;
	return images === null ? null : images[imageIndex];
}

function getAllImages(className) {
  // You have to pass in string literals to the require function (for security reasons I assume).
  switch (className) {
    case 'amberjack':
      return [
        require('../../assets/images/fish/amberjack_modified_thumbnail.png'),
        require('../../assets/images/fish/amberjack_modified.png'),
      ]
    case 'australian_bass':
      return [
        require('../../assets/images/fish/australian_bass_modified_thumbnail.png'),
        require('../../assets/images/fish/australian_bass_modified.png'),
      ]
    case 'barramundi':
      return [
        require('../../assets/images/fish/barramundi_1_modified_thumbnail.png'),
        require('../../assets/images/fish/barramundi_1_modified.png'),
      ]
    case 'barred_cheek_coral_trout':
      return [
        require('../../assets/images/fish/barred_cheek_coral_trout_modified_thumbnail.png'),
        require('../../assets/images/fish/barred_cheek_coral_trout_modified.png'),
      ]
    case 'barred_javelin':
      return [
        require('../../assets/images/fish/barred_javelin_modified_thumbnail.png'),
        require('../../assets/images/fish/barred_javelin_modified.png'),
      ]
    case 'barred_queenfish':
      return [
        require('../../assets/images/fish/barred_queenfish_modified_thumbnail.png'),
        require('../../assets/images/fish/barred_queenfish_modified.png'),
      ]
    case 'bartailed_flathead':
      return [
        require('../../assets/images/fish/bartailed_flathead_1_modified_thumbnail.png'),
        require('../../assets/images/fish/bartailed_flathead_1_modified.png'),
      ]
    case 'bigeye_trevally':
      return [
        require('../../assets/images/fish/bigeye_trevally_modified_thumbnail.png'),
        require('../../assets/images/fish/bigeye_trevally_modified.png'),
      ]
    case 'black_jewfish':
      return [
        require('../../assets/images/fish/black_jewfish_modified_thumbnail.png'),
        require('../../assets/images/fish/black_jewfish_modified.png'),
      ]
    case 'black_reef_leatherjacket':
      return [
        require('../../assets/images/fish/black_reef_leatherjacket_modified_thumbnail.png'),
        require('../../assets/images/fish/black_reef_leatherjacket_modified.png'),
      ]
    case 'black_tipped_rockcod':
      return [
        require('../../assets/images/fish/black_tipped_rockcod_modified_thumbnail.png'),
        require('../../assets/images/fish/black_tipped_rockcod_modified.png'),
      ]
    case 'blackbanded_amberjack':
      return [
        require('../../assets/images/fish/blackbanded_amberjack_modified_thumbnail.png'),
        require('../../assets/images/fish/blackbanded_amberjack_modified.png'),
      ]
    case 'blackspotted_rockcod':
      return [
        require('../../assets/images/fish/blackspotted_rockcod_modified_thumbnail.png'),
        require('../../assets/images/fish/blackspotted_rockcod_modified.png'),
      ]
    case 'bludger_trevally':
      return [
        require('../../assets/images/fish/bludger_trevally_modified_thumbnail.png'),
        require('../../assets/images/fish/bludger_trevally_modified.png'),
      ]
    case 'blue_maori':
      return [
        require('../../assets/images/fish/blue_maori_modified_thumbnail.png'),
        require('../../assets/images/fish/blue_maori_modified.png'),
      ]
    case 'blue_spotted_coral_trout':
      return [
        require('../../assets/images/fish/blue_spotted_coral_trout_modified_thumbnail.png'),
        require('../../assets/images/fish/blue_spotted_coral_trout_modified.png'),
      ]
    case 'blue_threadfin':
      return [
        require('../../assets/images/fish/blue_threadfin_modified_thumbnail.png'),
        require('../../assets/images/fish/blue_threadfin_modified.png'),
      ]
    case 'blue_tuskfish':
      return [
        require('../../assets/images/fish/blue_tuskfish_modified_thumbnail.png'),
        require('../../assets/images/fish/blue_tuskfish_modified.png'),
      ]
    case 'brown_sweetlips':
      return [
        require('../../assets/images/fish/brown_sweetlips_modified_thumbnail.png'),
        require('../../assets/images/fish/brown_sweetlips_modified.png'),
      ]
    case 'buffalo_emperor':
      return [
        require('../../assets/images/fish/buffalo_emperor_modified_thumbnail.png'),
        require('../../assets/images/fish/buffalo_emperor_modified.png'),
      ]
    case 'cobia':
      return [
        require('../../assets/images/fish/cobia_modified_thumbnail.png'),
        require('../../assets/images/fish/cobia_modified.png'),
      ]
    case 'dark_tailed_seaperch':
      return [
        require('../../assets/images/fish/dark_tailed_seaperch_modified_thumbnail.png'),
        require('../../assets/images/fish/dark_tailed_seaperch_modified.png'),
      ]
    case 'diamond_trevally':
      return [
        require('../../assets/images/fish/diamond_trevally_modified_thumbnail.png'),
        require('../../assets/images/fish/diamond_trevally_modified.png'),
      ]
    case 'diamondscale_mullet':
      return [
        require('../../assets/images/fish/diamondscale_mullet_modified_thumbnail.png'),
        require('../../assets/images/fish/diamondscale_mullet_modified.png'),
      ]
    case 'dusky_flathead':
      return [
        require('../../assets/images/fish/dusky_flathead_1_modified_thumbnail.png'),
        require('../../assets/images/fish/dusky_flathead_1_modified.png'),
      ]
    case 'ferocious_puffer':
      return [
        require('../../assets/images/fish/ferocious_puffer_modified_thumbnail.png'),
        require('../../assets/images/fish/ferocious_puffer_modified.png'),
      ]
    case 'frypan_bream':
      return [
        require('../../assets/images/fish/frypan_bream_modified_thumbnail.png'),
        require('../../assets/images/fish/frypan_bream_modified.png'),
      ]
    case 'giant_queenfish':
      return [
        require('../../assets/images/fish/giant_queenfish_modified_thumbnail.png'),
        require('../../assets/images/fish/giant_queenfish_modified.png'),
      ]
    case 'giant_trevally':
      return [
        require('../../assets/images/fish/giant_trevally_modified_thumbnail.png'),
        require('../../assets/images/fish/giant_trevally_modified.png'),
      ]
    case 'golden_snapper':
      return [
        require('../../assets/images/fish/golden_snapper_1_modified_thumbnail.png'),
        require('../../assets/images/fish/golden_snapper_1_modified.png'),
      ]
    case 'golden_trevally':
      return [
        require('../../assets/images/fish/golden_trevally_1_modified_thumbnail.png'),
        require('../../assets/images/fish/golden_trevally_1_modified.png'),
      ]
    case 'goldspotted_rockcod':
      return [
        require('../../assets/images/fish/goldspotted_rockcod_modified_thumbnail.png'),
        require('../../assets/images/fish/goldspotted_rockcod_modified.png'),
      ]
    case 'goldspotted_sweetlips':
      return [
        require('../../assets/images/fish/goldspotted_sweetlips_modified_thumbnail.png'),
        require('../../assets/images/fish/goldspotted_sweetlips_modified.png'),
      ]
    case 'great_barracuda':
      return [
        require('../../assets/images/fish/great_barracuda_modified_thumbnail.png'),
        require('../../assets/images/fish/great_barracuda_modified.png'),
      ]
    case 'grey_mackerel':
      return [
        require('../../assets/images/fish/grey_mackerel_1_modified_thumbnail.png'),
        require('../../assets/images/fish/grey_mackerel_1_modified.png'),
      ]
    case 'highfin_amberjack':
      return [
        require('../../assets/images/fish/highfin_amberjack_modified_thumbnail.png'),
        require('../../assets/images/fish/highfin_amberjack_modified.png'),
      ]
    case 'king_threadfin':
      return [
        require('../../assets/images/fish/king_threadfin_1_modified_thumbnail.png'),
        require('../../assets/images/fish/king_threadfin_1_modified.png'),
      ]
    case 'lesser_queenfish':
      return [
        require('../../assets/images/fish/lesser_queenfish_modified_thumbnail.png'),
        require('../../assets/images/fish/lesser_queenfish_modified.png'),
      ]
    case 'longtail_tuna':
      return [
        require('../../assets/images/fish/longtail_tuna_modified_thumbnail.png'),
        require('../../assets/images/fish/longtail_tuna_modified.png'),
      ]
    case 'luderick':
      return [
        require('../../assets/images/fish/luderick_1_modified_thumbnail.png'),
        require('../../assets/images/fish/luderick_1_modified.png'),
      ]
    case 'mackerel_tuna':
      return [
        require('../../assets/images/fish/mackerel_tuna_modified_thumbnail.png'),
        require('../../assets/images/fish/mackerel_tuna_modified.png'),
      ]
    case 'mahi_mahi':
      return [
        require('../../assets/images/fish/mahi_mahi_modified_thumbnail.png'),
        require('../../assets/images/fish/mahi_mahi_modified.png'),
      ]
    case 'mangrove_jack':
      return [
        require('../../assets/images/fish/mangrove_jack_1_modified_thumbnail.png'),
        require('../../assets/images/fish/mangrove_jack_1_modified.png'),
      ]
    case 'mulloway':
      return [
        require('../../assets/images/fish/mulloway_1_modified_thumbnail.png'),
        require('../../assets/images/fish/mulloway_1_modified.png'),
      ]
    case 'needleskin_queenfish':
      return [
        require('../../assets/images/fish/needleskin_queenfish_modified_thumbnail.png'),
        require('../../assets/images/fish/needleskin_queenfish_modified.png'),
      ]
    case 'northern_whiting':
      return [
        require('../../assets/images/fish/northern_whiting_modified_thumbnail.png'),
        require('../../assets/images/fish/northern_whiting_modified.png'),
      ]
    case 'orangefin_ponyfish':
      return [
        require('../../assets/images/fish/orangefin_ponyfish_modified_thumbnail.png'),
        require('../../assets/images/fish/orangefin_ponyfish_modified.png'),
      ]
    case 'oxeye_herring':
      return [
        require('../../assets/images/fish/oxeye_herring_modified_thumbnail.png'),
        require('../../assets/images/fish/oxeye_herring_modified.png'),
      ]
    case 'painted_sweetlips':
      return [
        require('../../assets/images/fish/painted_sweetlips_1_modified_thumbnail.png'),
        require('../../assets/images/fish/painted_sweetlips_1_modified.png'),
      ]
    case 'papuan_jawfish':
      return [
        require('../../assets/images/fish/papuan_jawfish_modified_thumbnail.png'),
        require('../../assets/images/fish/papuan_jawfish_modified.png'),
      ]
    case 'queensland_groper':
      return [
        require('../../assets/images/fish/queensland_groper_1_modified_thumbnail.png'),
        require('../../assets/images/fish/queensland_groper_1_modified.png'),
      ]
    case 'rainbow_monocle_bream':
      return [
        require('../../assets/images/fish/rainbow_monocle_bream_modified_thumbnail.png'),
        require('../../assets/images/fish/rainbow_monocle_bream_modified.png'),
      ]
    case 'redthroat_emperor':
      return [
        require('../../assets/images/fish/redthroat_emperor_1_modified_thumbnail.png'),
        require('../../assets/images/fish/redthroat_emperor_1_modified.png'),
      ]
    case 'reef_stonefish':
      return [
        require('../../assets/images/fish/reef_stonefish_modified_thumbnail.png'),
        require('../../assets/images/fish/reef_stonefish_modified.png'),
      ]
    case 'saddletail_snapper':
      return [
        require('../../assets/images/fish/saddletail_snapper_modified_thumbnail.png'),
        require('../../assets/images/fish/saddletail_snapper_modified.png'),
      ]
    case 'samsonfish':
      return [
        require('../../assets/images/fish/samsonfish_modified_thumbnail.png'),
        require('../../assets/images/fish/samsonfish_modified.png'),
      ]
    case 'sand_whiting':
      return [
        require('../../assets/images/fish/sand_whiting_1_modified_thumbnail.png'),
        require('../../assets/images/fish/sand_whiting_1_modified.png'),
      ]
    case 'school_mackerel':
      return [
        require('../../assets/images/fish/school_mackerel_modified_thumbnail.png'),
        require('../../assets/images/fish/school_mackerel_modified.png'),
      ]
    case 'sea_mullet':
      return [
        require('../../assets/images/fish/sea_mullet_1_modified_thumbnail.png'),
        require('../../assets/images/fish/sea_mullet_1_modified.png'),
      ]
    case 'sevenspot_archer_fish':
      return [
        require('../../assets/images/fish/sevenspot_archer_fish_modified_thumbnail.png'),
        require('../../assets/images/fish/sevenspot_archer_fish_modified.png'),
      ]
    case 'silver_jewfish':
      return [
        require('../../assets/images/fish/silver_jewfish_modified_thumbnail.png'),
        require('../../assets/images/fish/silver_jewfish_modified.png'),
      ]
    case 'small_spotted_dart':
      return [
        require('../../assets/images/fish/small_spotted_dart_modified_thumbnail.png'),
        require('../../assets/images/fish/small_spotted_dart_modified.png'),
      ]
    case 'snapper':
      return [
        require('../../assets/images/fish/snapper_1_modified_thumbnail.png'),
        require('../../assets/images/fish/snapper_1_modified.png'),
      ]
    case 'snub_nosed_dart':
      return [
        require('../../assets/images/fish/snub_nosed_dart_modified_thumbnail.png'),
        require('../../assets/images/fish/snub_nosed_dart_modified.png'),
      ]
    case 'spanish_flag':
      return [
        require('../../assets/images/fish/spanish_flag_modified_thumbnail.png'),
        require('../../assets/images/fish/spanish_flag_modified.png'),
      ]
    case 'spanish_mackerel':
      return [
        require('../../assets/images/fish/spanish_mackerel_1_modified_thumbnail.png'),
        require('../../assets/images/fish/spanish_mackerel_1_modified.png'),
      ]
    case 'spotted_mackerel':
      return [
        require('../../assets/images/fish/spotted_mackerel_1_modified_thumbnail.png'),
        require('../../assets/images/fish/spotted_mackerel_1_modified.png'),
      ]
    case 'spotted_sicklefish':
      return [
        require('../../assets/images/fish/spotted_sicklefish_modified_thumbnail.png'),
        require('../../assets/images/fish/spotted_sicklefish_modified.png'),
      ]
    case 'starry_flounder':
      return [
        require('../../assets/images/fish/starry_flounder_modified_thumbnail.png'),
        require('../../assets/images/fish/starry_flounder_modified.png'),
      ]
    case 'stout_whiting':
      return [
        require('../../assets/images/fish/stout_whiting_1_modified_thumbnail.png'),
        require('../../assets/images/fish/stout_whiting_1_modified.png'),
      ]
    case 'striped_barracuda':
      return [
        require('../../assets/images/fish/striped_barracuda_modified_thumbnail.png'),
        require('../../assets/images/fish/striped_barracuda_modified.png'),
      ]
    case 'swallow_tailed_dart':
      return [
        require('../../assets/images/fish/swallow_tailed_dart_modified_thumbnail.png'),
        require('../../assets/images/fish/swallow_tailed_dart_modified.png'),
      ]
    case 'tailor':
      return [
        require('../../assets/images/fish/tailor_1_modified_thumbnail.png'),
        require('../../assets/images/fish/tailor_1_modified.png'),
      ]
    case 'tarwhine':
      return [
        require('../../assets/images/fish/tarwhine_modified_thumbnail.png'),
        require('../../assets/images/fish/tarwhine_modified.png'),
      ]
    case 'threespin_frogfish':
      return [
        require('../../assets/images/fish/threespin_frogfish_modified_thumbnail.png'),
        require('../../assets/images/fish/threespin_frogfish_modified.png'),
      ]
    case 'tripletail':
      return [
        require('../../assets/images/fish/tripletail_modified_thumbnail.png'),
        require('../../assets/images/fish/tripletail_modified.png'),
      ]
    case 'trumpeter_whiting':
      return [
        require('../../assets/images/fish/trumpeter_whiting_modified_thumbnail.png'),
        require('../../assets/images/fish/trumpeter_whiting_modified.png'),
      ]
    case 'wahoo':
      return [
        require('../../assets/images/fish/wahoo_modified_thumbnail.png'),
        require('../../assets/images/fish/wahoo_modified.png'),
      ]
    case 'wolf_herring':
      return [
        require('../../assets/images/fish/wolf_herring_modified_thumbnail.png'),
        require('../../assets/images/fish/wolf_herring_modified.png'),
      ]
    case 'yellowfin_bream':
      return [
        require('../../assets/images/fish/yellowfin_bream_1_modified_thumbnail.png'),
        require('../../assets/images/fish/yellowfin_bream_1_modified.png'),
      ]
    case 'yellowfin_tripodfish':
      return [
        require('../../assets/images/fish/yellowfin_tripodfish_modified_thumbnail.png'),
        require('../../assets/images/fish/yellowfin_tripodfish_modified.png'),
      ]
    case 'yellowfin_tuna':
      return [
        require('../../assets/images/fish/yellowfin_tuna_1_modified_thumbnail.png'),
        require('../../assets/images/fish/yellowfin_tuna_1_modified.png'),
      ]
    case 'yellowtail_kingfish':
      return [
        require('../../assets/images/fish/yellowtail_kingfish_1_modified_thumbnail.png'),
        require('../../assets/images/fish/yellowtail_kingfish_1_modified.png'),
      ]
    default:
      return null;
  }
}
