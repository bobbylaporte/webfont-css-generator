<?
header('Content-Type: text/html; charset=utf-8');

$postsArray = include('../feed.php');


//print_r($postsArray);

$html = '';

foreach($postsArray[posts] as $post){
	$html .= '<article class="post">';

	switch ($post[type]){
	case regular: /* Blog Posts */
		$html .= '<h3 class="flag"><img src="images/flag_left.png" /><div class="repeat">' .  $post[content][title] . '</div><img src="images/flag_right.png" /></h3>';
		$html .= '<p>' .  $post[content][body] . '</p>';
		break;
	case photo: /* Photo Posts */
			$html .= '<caption>' . $post[content][caption] . '</caption>';
			$html .= '<img src="' . $post[content]["url-250"] . '" />';
		break;
	case link: /* Link Posts */
			$html .= '<a href="' . $post[content][url] . '">' . $post[content][text] . '</a>';
			$html .= '<p>' .  $post[content][description] . '</p>';
		break;
	case video: /* Video Posts */
			$html .= $post[content][player];
			$html .= '<p>' .  $post[content][caption] . '</p>';
		break;
	default:
		// We don't do anything for unhandled post types
	}
	$html .= '</article>';
}


echo $html;

/*  Important note : you can do as much getPosts request as you like!
/   It's impossible to have several times the same post in the array (array key composed with post's id and post's timestamp).
/*/

/*  Execution time counter */
/*
$nEndTime = microtime(true);
$nExecTime = $nEndTime - $nStartTime;
if ($aTumblr['stats']['num-inarray'] > 0) { $nExecTimePerPost = $nExecTime / $aTumblr['stats']['num-inarray']; } else { $nExecTimePerPost = 0; }
echo $aTumblr['stats']['num-inarray'].' posts parsed in '.$nExecTime.'s, that means '.$nExecTimePerPost.'s per post !'."\n\n";
*/
?>