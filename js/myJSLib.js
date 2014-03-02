
allMembers = {}
function findSharedFriends() {
    var selectedrows = {};
    $("#sortTableExample tr").each(function (index) {
        if (index > 0) {

            var uid = $(this).find('input:checkbox:checked').prop('id');

            var checked = $(this).find('input:checkbox:checked').prop('checked');
            if (checked) {
                selectedrows[uid] = allMembers[uid];
            }

        }

    });

    commonFriends = findCommenElements(selectedrows);
    sharedFriends = "";

    // fetch list of names from allmembers
    for (var i = 0; i < commonFriends.length; i++) {
        sharedFriends += allMembers[i]["name"] + "\n\r";
    }

    if (sharedFriends.length > 0)
        alert("Shared Friends:\n\r" + sharedFriends);
    else
        alert("Shared Friends: none");
}

function findCommenElements(selectedRows) {
    combinedFriendsIds = []
    selectedRowCount = 0;

    for (key in selectedRows) {
        for (var i = 0; i < selectedRows[key].friendids.length; i++) {
            combinedFriendsIds.push(selectedRows[key].friendids[i]);
        }
        selectedRowCount++;
    }

    combinedFriendsIds.sort(function (a, b) { return a - b; });

    commonFriendIds = []
    foundcommonelem = 1;
    currentelem = combinedFriendsIds[0];
    prevelem = combinedFriendsIds[0];

    // find common elements by iterating through array and incrementing count 
    for (var i = 0; i < combinedFriendsIds.length - 1; i++) {
        currentelem = combinedFriendsIds[i + 1];

        if (prevelem == currentelem) {
            foundcommonelem++;
            if (foundcommonelem == selectedRowCount) {
                commonFriendIds.push(combinedFriendsIds[i]);
                foundcommonelem = 1;
            }
        }
        else {
            foundcommonelem = 1;
            prevelem = combinedFriendsIds[i + 1];
        }
    }
    return commonFriendIds;
}

$(document).ready(function () {

    $.getJSON("https://dl.dropboxusercontent.com/s/3q0la2vaw1op72t/people.json?dl=1").done(function (data) {

        $.each(data, function (i, item) {
            $("#sortTableExample").append("<tr><td><input id=" + item.id + " type=\"checkbox\"></td><td><img width=\"100\" height=\"100\" src=\"" + item.picture + "\"/></td><td>" + item.gender + "</td><td>" + item.name.first + "</td><td>" + item.name.last + "</td><td>" + item.email + "</td><td>" + item.location.street + "<br>" + item.location.city + "<br>" + item.location.state + "<br>" + item.location.zip + "</td></tr>")

            allMembers[item.id] = { name: item.name.first + " " + item.name.last, friendids: item.friendIds.sort(function (a, b) { return a - b }) };
        });
    }).done(function()
    {
        if ($("table#sortTableExample tbody tr").length > 0)
            $("#sortTableExample").tablesorter(
                {
                    headers: {
                        0: { sorter: false },
                        1: {sorter:false}
                    },
                    sortList: [[1, 0]]
                });
    });

}
);