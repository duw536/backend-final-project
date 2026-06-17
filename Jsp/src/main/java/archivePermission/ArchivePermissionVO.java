package archivePermission;

public class ArchivePermissionVO {
    private int permissionId;
    private int aid;
    private String permissionName;
    private int canManageMember;
    private int canManageInfo;
    private int canManageTag;
    
	public int getPermissionId() {
		return permissionId;
	}
	public void setPermissionId(int permissionId) {
		this.permissionId = permissionId;
	}
	public int getAid() {
		return aid;
	}
	public void setAid(int aid) {
		this.aid = aid;
	}
	public String getPermissionName() {
		return permissionName;
	}
	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}
	public int getCanManageMember() {
		return canManageMember;
	}
	public void setCanManageMember(int canManageMember) {
		this.canManageMember = canManageMember;
	}
	public int getCanManageInfo() {
		return canManageInfo;
	}
	public void setCanManageInfo(int canManageInfo) {
		this.canManageInfo = canManageInfo;
	}
	public int getCanManageTag() {
		return canManageTag;
	}
	public void setCanManageTag(int canManageTag) {
		this.canManageTag = canManageTag;
	}

}